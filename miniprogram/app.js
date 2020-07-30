App({
  onLaunch: function () {
    wx.cloud.init({
      traceUser: true
    });
  },
  globalData: {
    item: {}
  },
  nowdate(now_threshold) {
    var da = new Date(now_threshold);
    var delta = new Date() - da;
    now_threshold = parseInt(now_threshold, 10);
    if (isNaN(now_threshold)) {
      now_threshold = 0;
    }
    if (delta <= now_threshold) {
      return '刚刚';
    }
    var units = null;
    var conversions = {
      '毫秒': 1,
      '秒': 1000,
      '分钟': 60,
      '小时': 60,
      '天': 24,
      '月': 30,
      '年': 12
    };
    for (var key in conversions) {
      if (delta < conversions[key]) {
        break;
      } else {
        units = key;
        delta = delta / conversions[key];
      }
    }
    delta = Math.floor(delta);
    return [delta, units].join(" ") + "前";
  }
})