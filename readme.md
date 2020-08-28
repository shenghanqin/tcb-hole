# 论坛跨平台应用（小程序、WEB）

> #### 作者：Zira
> #### 应用：城市技术圈专用实践手册

## 知识点

* 小程序云开发
* 静态网站托管与按量付费
* CMS 内容管理效果 （提供 v2.0 内测效果）

  

## 一、项目概述
此项目是完全使用云开发后端服务构建的论坛应用，包含小程序和WEB端，两者的数据可以互通，而且权限也可以同步。

整体实践完此项目，可以帮助学习掌握云开发常用API在小程序、云函数、web端的使用；了解熟悉HTTP触发，匿名登录，自定义登录的使用；熟悉和掌握云调用在云函数中的使用。

本项目的云开发环境由小程序侧创建。所以在开始此项目前需要注册一个微信小程序，当然也可以使用已有的小程序账号。

## 二、部署步骤

#### （1）准备阶段
如果没有小程序开发者工具，请[下载](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)并安装。导入此项目的代码，在导入框的appid中填写已准备的[小程序appid](https://mp.weixin.qq.com/wxamp/devprofile/get_profile)。

导入后的开发者工具显示如下：
![](https://upload-dianshi-1255598498.file.myqcloud.com/01-e75a7194c72e632ac8843cb173b42d9940c169ec.png);

#### （2）云开发环境部署
打开开发者工具左上角【云开发】，进入云开发控制台。如果小程序没有创建过云开发，需要先开通并创建一个云开发环境。

当有云开发环境时，需要在设置页中点击【开通按量计费】
![](https://upload-dianshi-1255598498.file.myqcloud.com/02-7622ca98179c55bae979244a1fd2b4860c12cfc3.png)

在操作后，即将云开发环境转换为按量计费（按量计费仍然有免费额度，和基础版预付费一致，无需担心）

在浏览器中，打开[腾讯云控制台](https://cloud.tencent.com/login/mp?s_url=https%3A%2F%2Fconsole.cloud.tencent.com%2Ftcb),使用微信扫描二维码，选择当前小程序账号进行授权。

登录后选择刚按量付费的环境，点击进入，在左侧栏中点击静态网站托管，在页面中开启静态网站托管。
![](https://upload-dianshi-1255598498.file.myqcloud.com/03-236b2617c0a5b70d99dd8802b4cfb6ad2b83616d.png)

大约需要3分钟左右才会开通完毕。

点击左侧的环境-登录鉴权，在页面中将匿名登录开启，并在自定义登录一栏后点击下载私钥，将文件保存在项目目录中cloudfunctions/login下，并重命名文件为tcb_custom_login.json
![](https://upload-dianshi-1255598498.file.myqcloud.com/04-360ef6cc0133bf2c98ad45f3192451025a24a981.png)

关闭浏览器控制台！！！

重新关闭并打开小程序开发工具的云开发控制台，就会发现多了一个静态网站托管的TAB
![](https://upload-dianshi-1255598498.file.myqcloud.com/05-182931008e8ac8334831e6dc23773a1eac4a6223.png)

#### （3）云开发数据库的创建
在云开发控制台-数据库中，新建3个集合，分别为
- admin｜权限：仅创建者可读写
- comment | 权限：所有用户可读，仅创建者可读写
- forum ｜ 权限：所有用户可读，仅创建者可读写

![](https://upload-dianshi-1255598498.file.myqcloud.com/06-8097b9e1ffe02bea6848daff26b3d9c579760ed0.png)

#### （4）云开发云函数的部署
在小程序开发者工具中，打开cloudfunctions目录，将所有的子目录，均右键，在菜单中点击“上传并部署：云端安装依赖”;
![](https://upload-dianshi-1255598498.file.myqcloud.com/07-48887bdb2898acedd392fe52bc13f2a7ab709f90.png)

4个云函数在部署时会自动安装依赖。需要注意login下面需要有第2步下载的私钥文件。

#### （5）部署WEB页面文件
打开项目根目录下的hole.html文件，在第26行填写自己云开发环境ID，ID可以从云开发控制台设置页中找到。
![](https://upload-dianshi-1255598498.file.myqcloud.com/08-3a04d1a5d78acbe99229ba064274181118a78570.png)

打开云开发控制台-静态网站托管，将hole.html上传
![](https://upload-dianshi-1255598498.file.myqcloud.com/09-5ba16145434220ffb8371856d50d68185ac3ce2d.png)

点击网站配置，配置索引文件为hole.html，如下图所示
![](https://upload-dianshi-1255598498.file.myqcloud.com/10-2849b6a256e2d1a3acad0d30ec7d5bca23938abc.png)

将左侧默认域名在浏览器中打开，即可访问WEB页面。

#### （6）登录
在以上步骤完成后，重新运行小程序，即可在正常加载，页面中出现一个4位数字。将这个数字输入到WEB页面中，即可登录，拥有小程序的权限来操作。每个用户的数字不同，且不会变更。

## 三、关于项目
项目中的以数字登录的策略完全是为了简单直观的展示能力的使用过程，在真实的业务开发中，需要自行优化提升，减少被攻击的风险。

各城市大使，可以根据自己的技术和偏好场景，自由更改新增功能。以下是一些点子：
- 当帖子被评论时，可以收到微信订阅消息的通知
- 小程序端目前不支持有评论的帖子删除，请用云函数实现出来
…………

