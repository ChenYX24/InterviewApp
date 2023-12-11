package bootstrap

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
	"github.com/spf13/viper"
)

// InitSetting 加载配置文件
func InitSetting() {
	viper.SetConfigFile("./config/config.json")
	err := viper.ReadInConfig()
	fmt.Println("init setting" + viper.Get("database.type").(string))
	if err != nil {
		fmt.Printf("InitSetting fail,err:%v\n", err)
	}
}

func GetDatabaseInfo() (string, string) {
	var dbMap map[string]string
	dbMap = viper.GetStringMapString("database")
	var parse string = dbMap["user"] + ":" + dbMap["passwd"] + "@(" + dbMap["host"] + ")/" + dbMap["name"] + "?charset=" + dbMap["charset"] + "&parseTime=" + dbMap["parsetime"] + "&loc=Local"
	fmt.Println("dataParse:" + parse)
	return dbMap["type"], parse
}

// GetDatabase 加载数据库相关配置
func GetDatabase() *gorm.DB {
	InitSetting()
	dbType, dbParse := GetDatabaseInfo()
	db, err := gorm.Open(dbType, dbParse)
	if err != nil {
		fmt.Printf("InitDatabase fail,err:%v\n", err)
	}
	return db
}
