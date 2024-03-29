const baseUrl ="http://10.13.5.180:8220";
//const baseUrl = "http://106.12.27.52:8220";
const http = ({ url = '', param = {}, ...other } = {}) => {
  let timeStart = Date.now();
  return new Promise((resolve, reject) => {
    wx.request({
      url: getUrl(url),
      data: param,
      header: {
        'content-type': 'application/json', // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
        //'cookie': wx.getStorageSync('cookie')
      },
      ...other,
      complete: (res) => {
        wx.hideLoading();
        // console.log(`耗时${Date.now() - timeStart}`);
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      }
    })
  })
}

const getUrl = (url) => {
  // console.log(url);
  if (url.indexOf('://') == -1) {
    url = baseUrl + url;
  }
  return url
}

// get方法
const _get = (url, param = {}) => {
  wx.showLoading();
  return http({
    url,
    param
  })
}

const _post = (url, param = {}) => {
  wx.showLoading();
  return http({
    url,
    param,
    method: 'post'
  })
}

const _put = (url, param = {}) => {
  wx.showLoading();
  return http({
    url,
    param,
    method: 'put'
  })
}

const _delete = (url, param = {}) => {
  wx.showLoading();
  return http({
    url,
    param,
    method: 'put'
  })
}
module.exports = {
  baseUrl,
  _get,
  _post,
  _put,
  _delete
}