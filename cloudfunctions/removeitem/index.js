const tcb = require('@cloudbase/node-sdk');

const cloud = tcb.init();
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  //获取调用者信息
  const auth = cloud.auth().getUserInfo();
  let result = {};
  //根据id和自己的openid获取帖子
  let res = (await db.collection('forum').where({
    _id:event.id,
    _openid:auth.customUserId,//customUserId在login函数中生成时设置，用openid生成的
  }).get()).data;
  //如果存在,则开始删除流程
  if(res.length!=0){
    //将数据库中的信息移除
    result.main = await db.collection('forum').where({
      _id:event.id,
      _openid:auth.customUserId,
    }).remove();
    //将其中的图片删除
    result.img = await cloud.deleteFile({
      fileList:res[0].image
    })
    //将其中的评论删除
    await db.collection('comment').where({
      pid:event.id
    }).remove();
  }
  return result;
}