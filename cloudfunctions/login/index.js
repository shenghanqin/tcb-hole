const tcb = require('@cloudbase/node-sdk');
const cloud = tcb.init({
  env:tcb.SYMBOL_CURRENT_ENV,//取当前环境
  credentials: require('tcb_custom_login.json')
});
const db = cloud.database();

exports.main = async (event, context) => {
  let body = {};
  try{
    //判断传入参数是否有number
    if(event.queryStringParameters.number!=null){
      //有number，在数据库中查找TA
      const ids = (await db.collection('admin').where({
        _id:event.queryStringParameters.number
      }).get()).data;
      //如果数据库中有记录，不为空
      if(ids.length!=0){
        //生成登录用的ticket
        body.ticket = cloud.auth().createTicket(ids[0]._openid, {
          refresh: 10 * 60 * 1000
        });
        //将openid也传进去
        body.openid = ids[0]._openid;
        body.code = 0;
      }
    }
  }catch(e){
    body.code = -1;
    body.err = e;
    console.log(e);
  }
  return body;
};