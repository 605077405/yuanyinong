const http = require('../../../http/http.js');
const utils = require('../../../utils/util.js');
const toast = require('../../../utils/toast.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    navTab: ['待发布', '已发布'], 
    currentTab: 0,
    pageSize: 0,
    name: '',
    pushflag:2,//待发布
    shopMsgList: []
  },
  onShow: function () {
    var that=this;
    let datas = {
       name: this.data.name,
      pageSize: this.data.pageSize,
      openId: wx.getStorageSync("openId"),
      pushflag: that.data.pushflag
    }
    this.selctDatas(datas)
  },
  onLoad: function () {

  },
  selectById: function (e) {
    let pushflag = e.currentTarget.dataset.pushflag;
    let id = e.currentTarget.dataset.id;
    var url = `../messageEidt/messageEidt?id=${id}`
    if (pushflag==1){
      url = `../messageHistory/HistoryView/HistoryView?id=${id}&flag=1`
    }
  
  
    wx.navigateTo({
      url: url,
      fail: function (e) {
        console.log(e)
      }
    })

  },
  currentTab: function (e) {
    var that=this
    if (this.data.currentTab == e.currentTarget.dataset.idx) {
      return;
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    let pushflag=1;
    if (e.currentTarget.dataset.idx == 0) {
      pushflag=2;
    }
    this.setData({
      pageSize: 0,
      pushflag: pushflag
    })
    
    this.data.shopMsgList = [];
    let datas = {
      name: that.data.name,
      pageSize: 0,
      openId: wx.getStorageSync("openId"),
      pushflag: that.data.pushflag
    }
    this.selctDatas(datas)
  },
  onPullDownRefresh: function () {
    let that = this;
    let userName = wx.getStorageSync('username');
    if (userName && userName != '') {
      this.setData({
        pageSize: 0
      })
      let datas = {
        pageSize: 0,
        name: that.data.name,
        openId: wx.getStorageSync("openId"),
        pushflag: that.data.pushflag
      }
      this.selctDatas(datas)
    }
    else {
      toast.showMessage("请先授权", utils.gotologin)
    }
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    wx.showLoading({
      title: '加载中...',
    });
    let pageSize = this.data.pageSize + 10;
    this.setData({
      pageSize: pageSize
    })
    let datas = {
      pageSize: pageSize,
      openId: wx.getStorageSync("openId"),
      pushflag: that.data.pushflag
    }
    this.nextDatas(datas);
    // }
  },
  selctDatas(params) {
    http._post('/shopMsg/selShopMyMsg', params).then((res) => {
      if (res.code == 1) {
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].img != undefined) {
            let imgs = res.data[i].img.split(',');
            res.data[i].img = imgs[0]
          }
        }


        this.setData({
          shopMsgList: res.data
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  nextDatas(params) {
    http._post('/shopMsg/selShopMyMsg', params).then((res) => {
      if (res.code == 1) {
        if (res.data.length == 0) {
          return false;
        }
        let shuzu = this.data.shopMsgList.concat(res.data);
        this.setData({
          shopMsgList: shuzu
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
   onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  //赋值
  searchValue: function (e) {
    if (e.detail.value == '') {
      this.setData({
        name: ''
      });
    } else {
      this.setData({
        name: e.detail.value
      });
    }


  },
  search: function () {
    let datas = {
      pageSize: 0,
      name: this.data.name,
      openId: wx.getStorageSync("openId"),
      pushflag: this.data.pushflag
    }
    this.selctDatas(datas)
  }
})