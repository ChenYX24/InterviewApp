import React, { forwardRef, useEffect, useState} from 'react'
import SideBarCss from '../css/SideBar.module.css'

const SideBar = forwardRef(
    (
      { isInterviewer, roomId,forceShut, setForceShut },
      ref
    ) => {
      const [chats, setChats] = useState([])
      const [users, setUsers] = useState([])
      const [displayContent,setDisplayContent]= useState('chat')
      // const [forceShut, setForceShut] = useState(false)
      const [forceOut, setForceOut] = useState(false)
      const [uid, setUid] = useState('')
      const [username, setUsername] = useState('')

      //交互部分
      const [message, setMessage] = useState('');
      const [receivedMessage, setReceivedMessage] = useState('');
      const [socket, setSocket] = useState(null);

      useEffect(() => {
        setUid(localStorage.getItem("uuid"));
        setUsername(localStorage.getItem("username"));
        // 创建 WebSocket 连接
        const newSocket = new WebSocket('wss://ws.scutbot.icu/ws');
        // 存储 WebSocket 连接到组件状态中
        setSocket(newSocket);
        // 在组件卸载时关闭 WebSocket 连接
        return () => {
          newSocket.close();
        };
      },[])

      useEffect(() =>{
        if(socket)
        {
          // 监听连接建立事件
          socket.onopen = () => {
            console.log('WebSocket 连接已建立');
            // 可以在连接建立时发送一些初始化信息
            var auth = "admin";
            if(isInterviewer === false)
            auth = "user";
            init(roomId, uid, username, auth);
          };
        
          // 监听消息接收事件
          socket.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            setReceivedMessage(receivedData); // 更新状态
          };
        
          // 监听连接关闭事件
          socket.onclose = (event) => {
            console.log('WebSocket 连接已关闭:', event);
          };
        }
      },[socket])

      //这里处理的是接受消息的处理逻辑
      useEffect(() => {
        const messageType = receivedMessage.type;
        console.log(receivedMessage)
        switch(messageType)
        {
          case "send_msg":
            var isFromMe = false;
            var inputValue = receivedMessage.data.msg;
            var send = receivedMessage.data.username;
            handleChatSend(isFromMe,inputValue,send);
            break;
          case "get_out":
            setForceOut(true);
            break;
          case "shut_down":
            setForceShut(!forceShut);
            break;
          case "mapping":
            var usersData = receivedMessage.data.usermap;
            updateUsers(usersData);
            break;
        }
      }, [receivedMessage])

      // 这里处理强制静音
      useEffect(() => {
        if(forceShut === true)
        {
          console.log('已经被静音');
        }
        else
        {
          console.log('解除禁音')
        }
      },[forceShut])


      //这里处理强制退出
      useEffect(() => {
        if(forceOut === true)
        {
          //返回首页
          window.location.href = '/';
        }
      },[forceOut])

      //通过后端实时更新用户列表
      const updateUsers = (usersData) => {
        if(Array.isArray(usersData))
        {
          const updatedUsers = usersData.map((user, index) => {
            const { uuid, username, auth } = user; // 使用对象解构获取每个用户对象的属性
            return {
            id: (index + 1).toString(),
            uid: uuid,
            username: username,
            auth: auth,
            }
          });
          setUsers(updatedUsers);
        }
      }
      
      //传递JSON文件给后端
      const sendDataToBackEnd = (type, msg, receiver) => {
        const jsonData = {
          type: type,
          data: msg,
          receiver: receiver,
        };
       socket.send(JSON.stringify(jsonData));
      }

      //随机产生字符串username
      const getRandomWord = () => {
        const nowDate = new Date()
          .getTime()
          .toString()
          .substr(5, 15);
        const randowStr = Math.random()
          .toString(36)
          .substr(2);
        return `${nowDate}${randowStr}`;
      };

      //发送初始化消息
      const init = (roomid, uuid, username, auth) => {
        const jsonData = {
          roomid: roomid,
          uuid: uuid,
          username: username,
          auth: auth,
        };
        socket.send(JSON.stringify(jsonData));
      }

      //传递聊天框中的数据
      const passInput = (isFromMe,send) => {
        var inputValue = document.getElementsByName("myInput")[0].value;
        //传递到本地聊天记录
        handleChatSend(isFromMe,inputValue,send);
        //发送给后端同一份
        sendDataToBackEnd("send_msg", inputValue ,null);
      }

      //处理聊天记录信息（无论是本地的还是外部的）
      const handleChatSend = (isFromMe,content,send) => {
        // 这里是处理发送消息的逻辑，可以根据需要进行相应的处理
        // 例如，添加新消息到当前聊天记录中
        const newChat = {
          id: chats.length + 1,
          text: content.toString(),
          fromMe: isFromMe, // 或者根据实际情况设置为 false
          sender: send.toString(),
        };
        setChats([...chats, newChat]);
      };
    
      return(
      <div className={SideBarCss.chat_container}>
        <div className={SideBarCss.switch_buttons}>
          <button className={SideBarCss.button_left} onClick={() => setDisplayContent('chat')}>聊天</button>
          <button className={SideBarCss.button_right} onClick={() => setDisplayContent('users')}>用户</button>
        </div>
        {displayContent === 'chat' &&(
        <div className={SideBarCss.chat_list}> 
          <div className={SideBarCss.chat}>
            {chats.map((chat) => (   
              <div
                key={chat.id}
                className={chat.fromMe ? SideBarCss.from_me : SideBarCss.from_them}
              >
                <span>{chat.sender+":"}</span>
                <br></br>
                <span>{chat.text}</span>
                <br></br>
              </div>
            ))}
          </div>
          <div className={SideBarCss.input_area}>
          <textarea
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              name="myInput"
            />
            <div className={SideBarCss['button-wrapper']}>
              <button onClick={() => passInput(true,username)}>发送</button>
            </div>
          </div>
        </div>
        )}
        {displayContent === 'users' &&(
          <div className={SideBarCss.user_list}>
            <h3>用户列表</h3>
              {users.map((user) => (
                <div key={user.id} className={SideBarCss.user_row}>
                  <span>{user.username}</span>
                  {isInterviewer && user.auth === "user" && <button className={SideBarCss.button_user} onClick={() => sendDataToBackEnd("shut_down", null, user.uid)}>静音</button>}
                  {isInterviewer && user.auth === "user" && <button className={SideBarCss.button_user} onClick={() => sendDataToBackEnd("get_out", null, user.uid)}>移出</button>}
                </div>
              ))}
          </div>
        )}
      </div>
      )

      }
)

export default SideBar