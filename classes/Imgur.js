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
		
// oauth2 access_token: f57296f2e855f238bef025a3e591eacac6d51dab // 有效期为10年


const axios = require('axios');
const { json } = require('body-parser');
const FormData = require('form-data');
const fs = require('fs');

class Imgur{
  constructor(){
    this.clientId = '5b6d29b81f42b6e'
    this.clientSecret = '9bf53350800bb3f7475e8da149a89e12c8fadf42'
    this.redirectUrl = 'https://8080-cs-239467590834-default.cs-europe-west4-pear.cloudshell.dev/'
    this.accessToken = 'f57296f2e855f238bef025a3e591eacac6d51dab' // 有效期为10年
  }

  async uploadImage({filePath='', imageBuffer='', withAccount=true}){
    let image
    if(imageBuffer){
      image = imageBuffer.toString('base64')
    } else if(filePath){
      image = fs.createReadStream(filePath)
    }

    const form = new FormData();
    form.append('image', image)   

    const headers = {...form.getHeaders()}
    if(withAccount){
      headers['Authorization'] = `Bearer ${this.accessToken}` // 使用 OAuth 2.0 令牌
    } else {
      headers['Authorization'] = `Client-ID ${this.clientId}` // 匿名上传，这种上传图片不会永久存储
    }
    
    try{
      const response = await axios.post('https://api.imgur.com/3/upload', form, {
        headers
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

  // 下载图片到本地
  async downloadImage(imgUrl, filePath){
    const res = await axios({
      url: imgUrl,
      responseType: 'stream',
    })
    return new Promise((resolve, reject) => {
      const writer = fs.createWriteStream(filePath)
      res.data.pipe(writer)
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  }

  // oauth2授权入口： https://api.imgur.com/oauth2/authorize?client_id=5b6d29b81f42b6e&response_type=code
  async getOauth2Token(authorizationCode){
    try{
      const response = await axios.post('https://api.imgur.com/oauth2/token', {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_url: this.redirectUrl
      })

      const token = response.data;
      fs.writeFileSync('./imgur_token.json', JSON.stringify(token))
      console.log('Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting access token:', error.response.data);
    }
  }

}

module.exports = Imgur
if(module === require.main){
  (async () => {
    const imgur = new Imgur()
    await imgur.downloadImage('https://i.imgur.com/j9B0am3.jpeg', '../output.png')
    console.log(111)
  })()
}