const http = require('../../../http/http.js');
const utils = require('../../../utils/util.js');
const toast = require('../../../utils/toast.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    pageSize:0,
    name: '',
    shopMsgList:[]
  },
  onShow: function () {
    let datas = {
      pageSize: this.data.pageSize,
      name: this.data.name
    }
    this.selctDatas(datas)
  },
  onLoad:function(){
   
  },
  selectById:function(e){
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../messageView/messageView?id=${id}`,
      fail:function(e){
        console.log(e)
      }
    })

  },
  onPullDownRefresh: function () {
    let that=this;
    let userName = wx.getStorageSync('username');
    if ( userName && userName != '') {
      this.setData({
        pageSize: 0
      })
      let datas = {
        pageSize: 0,
        name: this.data.name
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
      pageSize:pageSize
    })
    let datas = {
      pageSize: pageSize
    }
    this.nextDatas(datas);
    // }
  },
  selctDatas(params) {
    http._post('/shopMsg/selShopMsg', params).then((res) => {
      if (res.code == 1) {
        if (res.data.length == 0) {
          return false;
        }
  for(var i=0;i<res.data.length;i++){
    if (res.data[i].img!=undefined){
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
    http._post('/shopMsg/selShopMsg', params).then((res) => {
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
  pushMessage:function(){
    wx.navigateTo({
      url: `../messageNew/messageNew`,
      fail: function (e) {
        console.log(e)
      }
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
  search:function(){

    let datas = {
      pageSize: 0,
      name:this.data.name
    }
    this.selctDatas(datas)
  }
})