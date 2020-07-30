const app = getApp()
const db = wx.cloud.database()
const _ = db.command;
var that = null;
Page({
  onLoad(){
    that = this;
    that.setData({
      item:app.globalData.item
    });
  },
  onShow(){
    that.init();
    wx.getSetting({
      success(res){
        if(res.authSetting['scope.userInfo']==true){
          wx.getUserInfo({
            success(res){
              that.setData({
                myimg:res.userInfo.avatarUrl
              });
            }
          })
        }
      }
    })
  },
  init(){
    //加载帖子的评论
    db.collection('comment').where({
      pid:that.data.item._id
    }).get()
    .then(result => {
      console.log(result);
      let items = result.data.map(item =>{
        item.date = app.nowdate(item.date);
        return item;
      })
      that.setData({
        comment:items,
        text:''
      })
      wx.hideLoading();
      wx.hideNavigationBarLoading();
    })
  },
  gettext(e){
    that.setData({
      text: e.detail.value
    })
  },
  comment(e){
    //提交评论
    if(e.detail.userInfo){
      that.authorname = e.detail.userInfo.nickName;
      that.authorimg = e.detail.userInfo.avatarUrl;
      if(that.data.text.length>5){
        wx.showLoading({
          title: '评论中',
          mask:true
        })
        //文字安全检查
        wx.cloud.callFunction({
          name:'textsec',//云函数名称
          data:{
            text:that.data.text//检测的文字
          },
          success(){//文字安全
            //TODO 评论帖子
            db.collection('comment').add({
              data: {
                pid:that.data.item._id,
                content:that.data.text,
                date:new Date(),
                authorname:that.authorname,
                authorimg:that.authorimg
              }
            }).then(result => {
              that.init();
            })
            //TODO 评论帖子
          },
          fail(e){//文字不安全
            wx.hideLoading();
            wx.showModal({
              title:'提示',
              content:'你的评论中有不安全内容，请修整后重试',
              showCancel:false
            })
          }
        })
      }
      else{
        wx.showModal({
          title:'提示',
          content:'需要写5个字以上才能发表评论',
          showCancel:false
        })
      }
    }
    else{
      wx.showModal({
        title:'提示',
        content:'为了实名安全考虑，你需要授权信息才可以发表评论',
        showCancel:false
      })
    }
  },
  removeitem(e){
    //删除自己的评论
    wx.showLoading({
      title: '删除中',
      mask:true
    })
    console.log(e);
    db.collection('comment').doc(e.currentTarget.dataset.item._id).remove()
    .then(res => {
        that.init();
    }).catch(err=>console.log(err))
  },
  previewimg(e) {
    //浏览图片
    wx.previewImage({
      urls: that.data.item.image,
      current: e.currentTarget.dataset.url
    })
  },
  removemain(e){
    //删除帖子，此删除需要在无评论的情况下才可以删除，如果要做到全删除，请使用云函数来进行
    //在数据库安全规则中，设置的为所有可读，仅创建和管理员可读写。评论有其他创建者的话，则无法从小程序端完成删除
    //绝对不建议为了简化开发，而设置所有可读写策略，会增大危险性
    wx.showModal({
      title: '提示',
      content: '是否要删除该帖子',
      success(res) {
        if(res.confirm){
          wx.showLoading({
            title: '删除中',
            mask:true
          })
          console.log(e);
          db.collection('forum').doc(that.data.item._id).remove()
          .then(res => {
            wx.cloud.deleteFile({
              fileList:that.data.item.image
            }).then(result => {
              wx.navigateBack({
                delta:1
              })
            });
          }).catch(err=>{
            wx.navigateBack({
              delta:1
            })
          })
        }
      }
    });

  }
})
