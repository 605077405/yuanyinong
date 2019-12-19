module.exports = {
  success(text, duration, cb) {
    if (typeof duration === 'function') {
      cb = duration;
    }
    let time = typeof duration === 'number' && duration || 2000;

    wx.showToast({
      title: text,
      duration: time,
      mask: true,
      success() {
        setTimeout(() => {
          cb && cb();
        }, time)
      }
    })
  },
  loading(text, duration, cb) {
    if (typeof duration === 'function') {
      cb = duration;
    }
    let time = typeof duration === 'number' && duration || 2000;

    wx.showToast({
      icon: 'loading',
      title: text,
      duration: time,
      mask: true,
      success() {
        setTimeout(() => {
          cb && cb();
        }, time)
      }
    })
  },
  warning(text, duration, cb) {
    if (typeof duration === 'function') {
      cb = duration;
    }
    let time = typeof duration === 'number' && duration || 2000;
    wx.showToast({
      image: '/assets/images/common/warning.png',
      title: text,
      duration: time,
      mask: true,
      success() {
        setTimeout(() => {
          cb && cb();
        }, time)
      }
    })
  },
  showMessage(text, duration, cb) {
    if (typeof duration === 'function') {
      cb = duration;
    }
    let time = typeof duration === 'number' && duration || 1000;
    wx.showToast({
      icon:'none',
      title: text,
      duration: time,
      mask: true,
      success() {
        setTimeout(() => {
          cb && cb();
        }, time)
      }
    })
  }
}