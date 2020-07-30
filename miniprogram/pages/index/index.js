const app = getApp();
const db = wx.cloud.database()
const _ = db.command;
var that = null;
Page({
  onLoad(){
    that = this;
  },
  onShow(){
    wx.showNavigationBarLoading()
    that.init();
    that.toadmin();
  },
  toAdd(){
    wx.navigateTo({
      url: '../add/add',
    })
  },
  toadmin(){
    //TODO 管理初始化，查询admin集合中有没有自己的信息
    wx.cloud.database().collection('admin').get()
    .then(res => {
        let number = -1;
        //有信息，显示信息
        if (res.data.length != 0) {
            number = res.data[0]._id;
            that.setData({
              number: number
            })
        }
        else{//没有信息，新增信息
          that.addadmin();
        }
    });
    //TODO 管理初始化
  },
  addadmin(count = 1) {
    //TODO 新建管理用户码
    let that = this;
    wx.showLoading({
        title: '注册中(' + count + ')',
    });
    //随机产生4位数字
    const id = (Math.floor(Math.random() * (8999)) + 1000).toString();
    console.log('注册id:', id);
    wx.cloud.database().collection('admin').add({
        data: {
            _id: id
        }
    }).then(res => {
        //增加成功，显示增加的信息
        console.log(res);
        wx.hideLoading();
        that.setData({
            number: res._id
        })
    }).catch(e => {
        //增加失败，可能重复了，重复来一次新增，有弊端，人一多起来就gg了
        that.toadmin(count + 1);
        console.log(e);
    })
    //TODO 新建管理用户码
  },
  todetail(e){
    app.globalData.item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  init(){
    //TODO 加载帖子列表
    db.collection('forum').get()
    .then(result => {
      console.log(result);
      let items = result.data.map(item =>{
        item.date = app.nowdate(item.date);
        return item;
      })
      that.setData({
        items:items
      })
      wx.hideLoading();
      wx.hideNavigationBarLoading();
    })
    //TODO 加载帖子列表
  }
})