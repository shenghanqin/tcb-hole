const cloud = require('wx-server-sdk');
cloud.init()

exports.main = async (event, context) => {
  //下载此图片，获取文件内容
  const imgmsg = (await cloud.downloadFile({
    fileID: event.img,
  })).fileContent;

  //将文件内容构造image，使用云调用检测结果
  return cloud.openapi.security.imgSecCheck({
      media: {
        contentType: 'image/png',
        value: imgmsg
      }
    })
}