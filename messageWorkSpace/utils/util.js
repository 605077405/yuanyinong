const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 验证手机号
*/
function isPhone(checkedStr) {
  return /^1[34578]\d{9}$/.test(checkedStr);
}
/**
 * 跳转登录
 */
function gotologin(){
  wx.clearStorage();
  wx.redirectTo({
    url: '../../pages/login/login',
    fail: function (err) {
      console.log(err);
    }
  })
}
module.exports = {
  formatTime: formatTime,
  isPhone: isPhone,
  gotologin: gotologin
}

