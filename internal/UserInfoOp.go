package internal

import (
	"wsTest/bootstrap"
	"wsTest/model"
	"wsTest/utils"
)

var db = bootstrap.GetDatabase()

// NewUserInfo 创建用户，同时随机生成uuid
func NewUserInfo(name string, email string, passwd string) *model.UserInfo {
	uuid := utils.RandStringRunes(8)
	userinfo := &model.UserInfo{
		Uuid:   uuid,
		Name:   name,
		Email:  email,
		Passwd: passwd,
	}
	return userinfo
}

// GetAllUser 查询所有用户
func GetAllUser() []*model.UserInfo {
	var users []*model.UserInfo
	db.Find(&users)
	return users
}

// AddUser 添加用户
func AddUser(user *model.UserInfo) error {
	//db.AutoMigrate(&model.UserInfo{})
	return db.Create(user).Error
}

// DeleteUserByID 删除用户
func DeleteUserByID(uuid string) error {
	return db.Where("uuid = ?", uuid).Delete(&model.UserInfo{}).Error
}

// GetUserByID 按照指定的uuid查询用户
func GetUserByID(uuid string) (*model.UserInfo, int64, error) {
	var userinfo model.UserInfo
	result := db.Where("uuid = ?", uuid).First(&userinfo)
	return &userinfo, result.RowsAffected, result.Error
}

// GetUserByEmail 按照指定的email查询用户
func GetUserByEmail(email string) (*model.UserInfo, int64, error) {
	var userinfo model.UserInfo
	result := db.Where("email = ?", email).First(&userinfo)
	return &userinfo, result.RowsAffected, result.Error
}

// UpdateUser 更新用户
func UpdateUser(user *model.UserInfo) error {
	return db.Save(user).Error
}
