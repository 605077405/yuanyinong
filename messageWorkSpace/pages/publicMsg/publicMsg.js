const http = require('../../http/http.js');
const utils = require('../../utils/util.js');
const toast=require('../../utils/toast.js');
const base64 = require('../../utils/base64.js');
Page({
  data: {
    isBlock:true,
    stopLoadMoreTiem:false,
    onSocketOpen:false,
    pageSize:0,
    count:0,
    toView: 'toView',
    imgUrl: wx.getStorageSync("imgUrl"),
    username: wx.getStorageSync("username"),
    msg:'',
    lastId: "msg1",
    msgList: [],
    url: wx.getStorageSync("webSocketUrl"),
    flag: false,
    scrollTop: 100,
    scrollHeight: wx.getSystemInfoSync().windowHeight-120
  },
  onLoad: function (options) {
    let username = wx.getStorageSync("username");
    if (username == null || username == undefined || username == '') {
      toast.showMessage("请先授权", utils.gotologin)
      return
    } else {
      this.setData({
        isBlock:true,
        username: username,
        imgUrl: wx.getStorageSync("imgUrl"),
        url: wx.getStorageSync("webSocketUrl"),
      })

    }

    let that = this;
    if (!this.data.onSocketOpen) {
      //打开链接
      wx.connectSocket({
        url: this.data.url,
        fail:function(e){console.log(e)}
      });
    }
    wx.onSocketOpen(function () {
      that.setData({
        onSocketOpen: true
      })
    })
    wx.onSocketMessage(function (res) {
      var message = JSON.parse(res.data) || {};
      if (message.type == 'SPEAK') {
        var msgLists = that.data.msgList
        
        let data = {
          msg: message.msg,
          username: message.username,
          imgUrl: message.imgUrl

        }
        msgLists.push(data)
        var height = msgLists.length * 140;
        that.setData({
          msgList: msgLists,
          scrollTop: height
        })
      } else {
        that.setData({
          count: message.onlineCount
        })
      }
    })
  },
  scroll(e) {
    var that = this;
  if(that.data.isBlock){
    that.getLists();
    }
   
  },
  getLists:function(){
    this.setData({
      isBlock:false
    })
    let currChatItems = this.data.msgList;
    let datas = {
      pageSize: this.data.pageSize
    }
    http._post('/msg/selectMsg', datas).then((res) => {
      this.setData({
        isBlock: true
      })
      if(res.data.length!=0){
        this.setData({
          pageSize: this.data.pageSize + 20
        });
      }
     
      let store = res.data
      if(res.data.length!=0){
        store[0].showId = new Date().getTime();
      }
     
      let id = '';
      wx.createSelectorQuery().selectAll('.prevId').fields({
        id: true,
      }, function (res) {
        if (res.length != 0) {
          id = res[0].id;
        }

      }).exec();
      this.setData({
        msgList: store.concat(currChatItems)
      }, () => {
        this.setData({
          toView: id
        
        })
      })
    });

  },
  onShow: function () {
    let username=wx.getStorageSync("username");
    if (username == null || username == undefined || username==''){
      toast.showMessage("请先授权", utils.gotologin)
      return
  }else{
    this.setData({
      username: username,
      imgUrl: wx.getStorageSync("imgUrl"),
      url: wx.getStorageSync("webSocketUrl"),
    })
     
  }
    let that = this;
    let datas = {
      pageSize: 0
    }
    http._post('/msg/selectMsg', datas).then((res) => {
      if(res.data.length!=0){
        res.data[0].showId = new Date().getTime()
      }
    
      this.setData({
        msgList: res.data,
        scrollTop: res.data.length * 400
      })
    });
    // 页面出现在前台时执行
  },
  onReady: function () {
    // 页面首次渲染完毕时执行
  },
  onHide: function () {
    // 页面从前台变为后台时执行
  },
  onUnload: function () {
    // 页面销毁时执行
  },
  onPullDownRefresh: function () {

    // 触发下拉刷新时执行
  },
  onReachBottom: function () {
    // 页面触底时执行
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  onPageScroll: function () {
    // 页面滚动时执行
  },
  onResize: function () {
    // 页面尺寸变化时执行
  },
  onTabItemTap(item) {
    // tab 点击时执行
 
  },
  changeShowStatus: function () {
    var flag = this.data.flag;
    this.setData({ flag: !flag })
  },
  // 事件响应函数
  viewTap: function () {
    this.setData({
      text: 'Set some data for updating view.'
    }, function () {
      // this is setData callback
    })
  },
  sendMsg: function () {
   
  },

  sendMsgWz: function () {
    var that=this
    var msgLists=this.data.msgList
    var msg = this.data.msg
    var url=this.data.url
    if (msg === '') {
      return false;
    }else{
        //开始发送webscoet
    let data={
      msg: this.data.msg,
      username: this.data.username,
      imgUrl: this.data.imgUrl
    }
    wx.sendSocketMessage({
      data: JSON.stringify(data),
    })
    that.setData({
      msg:''
    })
    }
  },
  inputTyping: function (e) {
    var result = e.detail.value
    this.setData({
      msg: result
    });
  },
  
 
})