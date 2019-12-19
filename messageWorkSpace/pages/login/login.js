const http = require('../../http/http.js');
Page({
  data: {
    userInfo: {},
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    code:""
  },

  onLoad: function () {
    var that = this;
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
             
            }
          });
        } else {
          // 用户没有授权
          // 改变 isHide 的值，显示授权页面
          that.setData({
            isHide: true
          });
        }
      }
    });
  },

  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      that.setData({
        userInfo: e.detail.userInfo,
        isHide: false
      });
     
      wx.login({
        success (res){
          let params = {
            "userName": that.data.userInfo.nickName,
            "imgUrl": that.data.userInfo.avatarUrl,
            "code":res.code
          }
          http._post('/login/userLogin', params).then((res) => {
            if (res.code == 1) {
              wx.setStorageSync("webSocketUrl", res.webSocketUrl);
              wx.setStorageSync("username", that.data.userInfo.nickName);
              wx.setStorageSync("imgUrl", that.data.userInfo.avatarUrl);
              wx.setStorageSync("openId", res.data.openId);
              wx.switchTab({
                url: '../../pages/index/index',
              })
            }
          });
        }
      })  
     
    


    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          // 用户没有授权成功，不需要改变 isHide 的值
          if (res.confirm) {
            console.log('用户点击了“返回授权”');
          }
        }
      });
    }
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
})