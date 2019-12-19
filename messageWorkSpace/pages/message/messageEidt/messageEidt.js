


const http = require('../../../http/http.js');
const toast = require('../../../utils/toast.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    filep: [],
    upload_picture_list: [],
    id:"",
    name: "",
    flag: "",
    flagdesc: "",
    address: "",
    pipe: "",
    pipeChecked: "",
    picker: ['请选择', '斤/每', '公斤/每', '亩/每', '车/每'],
    phone: "",
    username: "",
    type: 1,
    img: "",
    xydesc: "",
    money: "",
    pushflag: "",
    pushflagChecked: "",
  },
  onLoad: function (options) {
    var that=this
    let datas = {
      id: options.id
    }
    http._post('/shopMsg/selectById', datas).then((res) => {
      let imgs = [];
      if (res.data.img != undefined) {
        imgs = res.data.img.split(',');
      }
      let imgdataArr=[]
      for(var i=0;i<imgs.length;i++){
       let imgdata={
         path: imgs[i],
         upload_percent:100,
         path_server: imgs[i]
       }
        imgdataArr.push(imgdata);
      }
      
      if (res.data != null) {
        this.setData({
          id:res.data.id,
          name:res.data.name,
          flag: res.data.flag,
          flagdesc: res.data.flagdesc,
          address: res.data.address,
          pipe: res.data.pipe,
          pipeChecked: res.data.pipe==1?true:false,
          phone: res.data.phone,
          username: res.data.username,
          type: res.data.type,
          xydesc: res.data.xydesc,
          money: res.data.money,
          pushflag: res.data.pushflag,
          pushflagChecked: res.data.pushflag == 1 ? true : false,
          upload_picture_list:imgdataArr
        })
      }


    });





  },

  onPickerChange: function (e) {
    this.setData({
      flag: e.detail.value
    })
   
  },
  pushflagChange: function (e) {
    if (e.detail.value) {
      this.setData({
        pushflag: 1
      })
    } else {
      this.setData({
        pushflag: 2
      })
    }
  
  },

  pipeChange: function (e) {
    if (e.detail.value) {
      this.setData({
        pipe: 1
      })
    } else {
      this.setData({
        pipe: 2
      })
    }
  },
  //选择图片方法
  uploadpic: function (e) {
    var that = this //获取上下文
    var upload_picture_list = that.data.upload_picture_list
    var filep = that.data.filep
    //选择图片
    wx.chooseImage({
      count: 8,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        var tempFiles = res.tempFiles
        var tempFilePaths = res.tempFilePaths

        //把选择的图片 添加到集合里
        for (var i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
          filep.push(tempFilePaths[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
          filep: filep
        });
        that.uploadimage()
      }
    })
  },
  //点击上传事件
  uploadimage: function () {
    var page = this
    var upload_picture_list = page.data.upload_picture_list
    //循环把图片上传到服务器 并显示进度       
    for (var j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //调用函数
        page.upload_file_server(page, upload_picture_list, j)
      }
    }
  },

  // 删除图片
  deleteImg: function (e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
  //上传方法
  upload_file_server: function (that, upload_picture_list, j) {
    //上传返回值
    const upload_task = wx.uploadFile({
      url: http.baseUrl + '/shopMsg/wx_upload',
      filePath: that.data.filep[j],
      name: 'file',
      formData: {
        'user': 'test'
      },
      success: function (res) {
        var data = JSON.parse(res.data);
        if (data.code == 1) {
          upload_picture_list[j]['upload_percent'] = 100
          upload_picture_list[j]['path_server'] = data.url
          that.setData({
            upload_picture_list: upload_picture_list
          });
        }
      }, fail: function (err) {
        console.log(err)
      }
    })
    //上传 进度方法
    upload_task.onProgressUpdate((res) => {
      console.log(res.progress)
      upload_picture_list[j]['upload_percent'] = res.progress
      that.setData({
        upload_picture_list: upload_picture_list

      });

    });
  },
  onSubtmit: function () {

    var that = this
    if (that.data.name == '') {
      toast.showMessage("农产名称不能为空");
      return
    }
    if (that.data.flag == '') {
      toast.showMessage("单位不能为空");
      return
    }
    if (that.data.money == '') {
      toast.showMessage("金额不能为空");
      return
    }
    if (that.data.username == '') {
      toast.showMessage("联系人不能为空");
      return
    }
    if (that.data.phone == '') {
      toast.showMessage("联系电话不能为空");
      return
    }
    if (that.data.address == '') {
      toast.showMessage("地址不能为空");
      return
    }
    var upload_picture_list = that.data.upload_picture_list;
    var img = "";
    for (var j in upload_picture_list) {
      img += upload_picture_list[j].path_server + ","
    }
    if (img != '') {
      img = img.substring(0, img.length - 1)
      that.setData({
        img: img
      })
    }
    if (that.data.img == '') {
      toast.showMessage("图片不能为空");
      return
    }

    let datas = {
      id:that.data.id,
      address: that.data.address,
      flag: that.data.flag,
      flagdesc: that.data.flagdesc,
      img: that.data.img,
      money: that.data.money,
      name: that.data.name,
      phone: that.data.phone,
      pipe: that.data.pipe,
      pushflag: that.data.pushflag,
      type: that.data.type,
      username: that.data.username,
      xydesc: that.data.xydesc,
      openId: wx.getStorageSync("openId"),
    }
    http._post('/shopMsg/upShopMyMsg', datas).then((res) => {
      if (res.code == 1) {
        toast.showMessage("提交成功");
        setTimeout(() => {
          wx.navigateBack({})
        }, 1000)
      }
    }).catch((err) => {
      console.log(err)
    })
  },
  //赋值
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  inputFlagdesc: function (e) {
    this.setData({
      flagdesc: e.detail.value
    });
  },
  inputAddress: function (e) {
    this.setData({
      address: e.detail.value
    });
  },
  inputPipe: function (e) {
    this.setData({
      pipe: e.detail.value
    });
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  inputUserName: function (e) {
    this.setData({
      username: e.detail.value
    });
  },
  inputXydesc: function (e) {
    this.setData({
      xydesc: e.detail.value
    });
  },
  inputMoney: function (e) {
    this.setData({
      money: e.detail.value
    });
  },
  //清空
  clearName: function () {
    this.setData({
      name: ""
    })
  },
  clearFlagdesc: function () {
    this.setData({
      flagdesc: ""
    })
  },
  onShareAppMessage: function () {
    // 页面被用户分享时执行
  },
})


