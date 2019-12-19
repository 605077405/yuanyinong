const http = require('../../../../http/http.js');
const toast = require('../../../../utils/toast.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    id:"",
    shopMsg: [],
    imgs: [],
    flagName: "",
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    downState:false
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },
  onLoad: function (options) {
    let downState=false
    if (options.flag != undefined){
      downState=true
    }
  
    let datas = {
      id: options.id
    }
    http._post('/shopMsg/selectById', datas).then((res) => {
      let imgs = "";
      if (res.data.img != undefined) {
        imgs = res.data.img.split(',');
      }
      let flagName = "";
      if (res.data != null) {
        if (res.data.flag == 1) {
          flagName = "斤";
        }
        if (res.data.flag == 2) {
          flagName = "公斤";
        }
        if (res.data.flag == 3) {
          flagName = "亩";
        }
        if (res.data.flag == 4) {
          flagName = "车";
        }
        this.setData({
          id:res.data.id,
          shopMsg: res.data,
          flagName: flagName,
          imgs: imgs,
          downState: downState
        })
      }


    });


  },
  callto() {
    wx.makePhoneCall({
      phoneNumber: this.data.shopMsg.phone
    })
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: current // 需要预览的图片http链接列表  
    })
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
  hositoryPush: function (e) {
    let openid = e.currentTarget.dataset.openid;
    wx.navigateTo({
      url: `../messageHistory/messageHistory?openid=${openid}`,
      fail: function (e) {
        console.log(e)
      }
    })

  },
  //下架
  onSudown:function(){
    let datas={
      id:this.data.id
    }
    http._post('/shopMsg/downShopMyMsg', datas).then((res) => {
      if (res.code == 1) {
        toast.showMessage("下架成功");
        setTimeout(() => {
          wx.navigateBack({})
        }, 1000)
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  
  reset: function() {
    let datas = {
      id: this.data.id
    }
    http._post('/shopMsg/resetShopMyMsg', datas).then((res) => {
      if (res.code == 1) {
        toast.showMessage("擦亮成功");
        setTimeout(() => {
          wx.navigateBack({})
        }, 1000)
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  //预览图片
  previewImg: function (e) {
    var currentUrl = e.currentTarget.dataset.currenturl
    var previewUrls = e.currentTarget.dataset.previewurl
    wx.previewImage({
      current: currentUrl, //必须是http图片，本地图片无效
      urls: previewUrls, //必须是http图片，本地图片无效
    })
  },
})