const http = require('../../http/http.js');
const utils = require('../../utils/util.js');
const toast = require('../../utils/toast.js');
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎登录易农',
    userName:'',
    flag:0,
    imgUrl:'',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
   
  },
  onShow: function () {
    let username = wx.getStorageSync("username");
    if (username == null || username == undefined || username == '') {
      toast.showMessage("请先授权", utils.gotologin)
      return
    } else {
      this.setData({
        flag:1,
        username: username,
        imgUrl: wx.getStorageSync("imgUrl")
      })
    }
  },
  goPush:function(){
    wx.navigateTo({
      url: `../message/myMessage/myMessage`,
      fail: function (e) {
        console.log(e)
      }
    })

  },
  callto() {
    wx.makePhoneCall({
      phoneNumber: '17610065565'
    })
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
})
