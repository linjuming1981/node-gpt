// 使用imgur接口上传图片	
// 	https://api.imgur.com/oauth2/addclient
		
		
// 	伟大的！现在您可以开始使用 API 了！
// 	对于公共只读和匿名资源，例如获取图像信息、查找用户评论等，您所需要做的就是在请求中发送包含您的 client_id 的授权标头。如果您想匿名上传图像（图像不与帐户绑定），或者您想创建匿名相册，这也适用。这让我们知道哪个应用程序正在访问 API。

// 	Authorization: Client-ID YOUR_CLIENT_ID
// 	要访问用户帐户，请访问文档的 OAuth2 部分。
// 	 客户编号：
// 	5b6d29b81f42b6e
// 	 客户秘密：
// 	9bf53350800bb3f7475e8da149a89e12c8fadf42
// 	爱伊姆古尔？加入我们的团队
		
const axios = require('axios');
const { json } = require('body-parser');
const FormData = require('form-data');
const fs = require('fs');

class Imgur{
  constructor(){
    this.clientId = '5b6d29b81f42b6e'
    this.clientSecret = '9bf53350800bb3f7475e8da149a89e12c8fadf42'
    this.redirectUrl = 'https://8080-cs-239467590834-default.cs-europe-west4-pear.cloudshell.dev/'
  }

  async uploadImage(filePath){
    const clientId = '5b6d29b81f42b6e'
    const image = fs.createReadStream(filePath)

    const form = new FormData();
    form.append('image', image)   
    
    try{
      const response = await axios.post('https://api.imgur.com/3/upload', form, {
        headers: {
          'Authorization': `Client-ID ${clientId}`,
          ...form.getHeaders()
        }
      })

      // 检查响应结果并获取图片连续
      if(response.data.success){
        return response.data.data.link
      } else {
        console.error('Failed to upload image:', response.data);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  }

  // oauth2授权入口： https://api.imgur.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&response_type=code
  async getOauth2Token(authorizationCode){
    try{
      const response = await axios.post('https://api.imgur.com/oauth2/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_url: this.redirectUrl
      })

      const accessToken = response.data.access_token;
      fs.writeFileSync('./imgur_token.json', JSON.stringify(accessToken))
      console.log('Access Token:', accessToken);
      return accessToken;
    } catch (error) {
      console.error('Error getting access token:', error.response.data);
    }
  }

}

module.exports = Imgur
if(module === require.main){
  (async () => {
    const imgur = new Imgur()
    const url = await imgur.uploadImage('../1.jpeg')
    console.log(1111, url)
  })()
}