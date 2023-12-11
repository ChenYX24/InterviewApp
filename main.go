package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/spf13/viper"
	"net/http"
	"wsTest/service"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

// 客户端连接
type Client struct {
	conn *websocket.Conn
	user *User
}

// 初始化数据
type Init struct {
	RoomId   string `json:"roomid"`
	Uuid     string `json:"uuid"`
	UserName string `json:"username"`
	Auth     string `json:"auth"`
}

// 接收的消息
type Message struct {
	Type     string `json:"type"`
	Data     string `json:"data"`
	Receiver string `json:"receiver"`
}

// 用户信息
type User struct {
	Uuid     string `json:"uuid"`
	Username string `json:"username"`
	Auth     string `json:"auth"`
}

// 响应的数据
type Data struct {
	UserMap  []User `json:"userMap"`
	Username string `json:"username"`
	Msg      string `json:"msg"`
}

// 响应体
type Response struct {
	Type string `json:"type"`
	Data Data   `json:"data"`
}

// 房间信息
type Room struct {
	RoomId  string `json:"roomId"`
	Clients []*Client
}

var (
	rooms []*Room //所有房间的集合
)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// 升级HTTP连接为WebSocket连接
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("升级连接失败")
		fmt.Println(err)
		return
	}

	//接收初始信息
	var initMessage Init
	err = conn.ReadJSON(&initMessage)
	if err != nil {
		fmt.Println("初始化失败：", err)
		return
	}
	//初始化用户信息
	fmt.Println("初始化信息：", initMessage)
	user := &User{
		Uuid:     initMessage.Uuid,
		Username: initMessage.UserName,
		Auth:     initMessage.Auth,
	}
	client := &Client{conn: conn, user: user}
	//获取RoomID
	roomId := "111"
	exist, room := CheckRoomID(roomId)
	//更新房间信息
	var currentRoom *Room
	if !exist {
		newRoom := Room{
			RoomId:  roomId,
			Clients: []*Client{client},
		}
		rooms = append(rooms, &newRoom)
		currentRoom = &newRoom
	} else {
		room.Clients = append(room.Clients, client)
		currentRoom = room
	}
	//走的时候关闭链接
	defer disConnnect(currentRoom, conn)

	//广播当前所有用户信息
	//1.构建响应
	var data Data
	for _, c := range currentRoom.Clients {
		data.UserMap = append(data.UserMap, *c.user)
	}
	respose := Response{
		Type: "mapping",
		Data: data,
	}
	//2.广播
	broadcastMessages(respose, currentRoom, client.user.Uuid)
	fmt.Println("Client connected")

	// 无限循环，处理从客户端接收的消息
	for {
		var message Message
		err = conn.ReadJSON(&message)
		if err != nil {
			fmt.Println("读取失败", err)
		}
		switch message.Type {
		case "get_out":
			{
				fmt.Println("踢人")
				GetOut(currentRoom, message.Receiver)
				break
			}
		case "shut_down":
			{
				fmt.Println("禁言")
				Shutdown(currentRoom, message.Receiver)
				break
			}
		case "send_msg":
			{
				fmt.Println("广播消息")
				data = Data{
					Username: client.user.Username,
					Msg:      message.Data,
				}
				response := Response{
					Type: "send_msg",
					Data: data,
				}
				broadcastMessages(response, currentRoom, client.user.Uuid)
				break
			}
		default:
			fmt.Println("未知消息类型")
		}
	}
}

// 踢人
func GetOut(currentRoom *Room, uuid string) {
	for _, client := range currentRoom.Clients {
		if client.user.Uuid == uuid {
			err := client.conn.WriteJSON(Response{Type: "shut_down"})
			if err != nil {
				fmt.Println("发送失败")
			}
			break
		}
		//断开连接
		disConnnect(currentRoom, client.conn)
	}
	fmt.Println("没有找到你想踢的用户")
}

// 禁言
func Shutdown(currentRoom *Room, uuid string) {
	for _, client := range currentRoom.Clients {
		if client.user.Uuid == uuid {
			err := client.conn.WriteJSON(Response{Type: "shut_down"})
			if err != nil {
				fmt.Println("发送失败")
			}
			break
		}
	}
	fmt.Println("没有找到你想禁言的用户")
}

// 广播消息
func broadcastMessages(message Response, currentRoom *Room, uuid string) {
	for _, client := range currentRoom.Clients {
		fmt.Println("message", message)
		if uuid != client.user.Uuid { //判断是不是自己，如果是自己就不发
			fmt.Println("发送消息给用户:", client.user.Username)
			err := client.conn.WriteJSON(message)
			if err != nil {
				fmt.Println("发送失败")
				fmt.Println(err)
			}
		}
	}
}

// 断开连接
func disConnnect(currentRoom *Room, conn *websocket.Conn) {
	for i, c := range currentRoom.Clients {
		if c.conn == conn {
			currentRoom.Clients = append(currentRoom.Clients[:i], currentRoom.Clients[i+1:]...)
			break
		}
	}
	conn.Close()
	fmt.Println("Client disconnected")
}

// 检查当前有没有这个房间号
func CheckRoomID(roomID string) (bool, *Room) {
	for _, room := range rooms {
		if room.RoomId == roomID {
			return true, room
		}
	}
	return false, nil
}

// 用户登录注册相关的路由
func handleUser() {
	r := gin.Default()
	r.POST("/login", service.Login)
	r.POST("/register", service.Register)
	r.POST("/passwd", service.ChangePasswd)
	r.Run(":" + viper.GetString("server.addr"))
}

func main() {
	go handleUser()

	http.HandleFunc("/ws", handleConnections)
	fmt.Println("WebSocket server running on :" + viper.GetString("server.port"))
	err := http.ListenAndServe(":"+viper.GetString("server.port"), nil)
	if err != nil {
		fmt.Println(err)
	}
}
