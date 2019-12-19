const http = require('../../http/http.js');
Page({
  data: {
    imgUrls: [],
    shopList:[],
    swiperIndex: 0,
    shareSituationList: [],
  },
  onShow:function(){
    http._post('/shopMsg/indexList', {}).then((res) => {
      if (res.code == 1) {
        let shopList=[]
        let shareSituationList=[]
        for (var i = 0; i < res.data.length; i++) {
          if (res.data[i].img != undefined) {
            let imgs = res.data[i].img.split(',');
           //图片轮播
            let imgArr = {
              imgurl: imgs[0],
              id:res.data[i].id

            }
            let flagName = "";
            if (res.data[i].flag == 1) {
                flagName = "斤";
              }
            if (res.data[i].flag == 2) {
                flagName = "公斤";
              }
            if (res.data[i].flag == 3) {
                flagName = "亩";
              }
            if (res.data[i].flag == 4) {
                flagName = "车";
              }
            //最新消息
            let shareSituationArr = {
              username: res.data[i].username,
              name: res.data[i].name,
              flag: res.data[i].flag,
              money: res.data[i].money,
              flagName: flagName,
              activeClass: false
            }
            shopList.push(imgArr)
            shareSituationList.push(shareSituationArr)
          }
        }
        this.setData({
          shopList: shopList,
          shareSituationList: shareSituationList
        })
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
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
  goView:function(e){
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `../message/messageView/messageView?id=${id}`,
      fail: function (e) {
        console.log(e)
      }
    })
  },
  onReady: function () {
    setInterval(() => {
      this.data.shareSituationList[0].activeClass = true;
      let data = this.data.shareSituationList.concat();
      data[0].activeClass = true;
      this.setData({
        shareSituationList: data
      })
      setTimeout(() => {
        let data = this.data.shareSituationList.concat();
        let pop = data.shift();
        pop.activeClass = false;
        data.push(pop);
        this.setData({
          shareSituationList: data
        })
      }, 1500);
    }, 3000);
  },
})