const tumblr = require('tumblr.js');

// 通过 https://www.tumblr.com/oauth/apps -> Explore API工具生成
let requestToken = 'GgB9Ksu9TM4BLWR4NXh41UP2GVMVm4AUZIhFVHxMcse4J3HKrS'
let requestTokenSecret = 'zJHleutK7X1zBXJyGXy31TXjKTkAgB9Yn9PWKFkvAcOHL5jwO8'

class Tumblr {
  constructor(){
    this.OAuth_Consumer_Key = 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik'
    this.Secret_Key = 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI'
    this.client = this.getClient()
  }

  getClient(){
    console.log('Consumer Key:', this.OAuth_Consumer_Key);
    console.log('Consumer Secret:', this.Secret_Key);
    const client = tumblr.createClient({
      consumer_key: this.OAuth_Consumer_Key ,
      consumer_secret: this.Secret_Key,
      returnPromises: true
    });
    return client
  }

  async requestToken(){
    try {
      const response = await this.client.getRequestToken('https://8080-cs-239467590834-default.cs-europe-west4-pear.cloudshell.dev/tumblrCallbak');
      requestToken = response.token;
      requestTokenSecret = response.secret;
      console.log(1111111, {requestToken, requestTokenSecret})
      
      const authUrl = `https://www.tumblr.com/oauth/authorize?oauth_token=${requestToken}`;
      const open = (await import('open')).default; // 动态导入 open 模块
      open(authUrl);
    } catch (error) {
      console.error('Error getting request token:', error);
    }
  }

  async getAccessToken(oauthVerifier){
    try {
      const response = await this.client.getAccessToken(requestToken, requestTokenSecret, oauthVerifier);
      const accessToken = response.token;
      const accessTokenSecret = response.secret;
  
      console.log('Access Token:', accessToken);
      console.log('Access Token Secret:', accessTokenSecret);
      return {accessToken, accessTokenSecret}
    } catch (error) {
      console.error('Error getting access token:', error);
    }
  }

}

module.exports = Tumblr

if(module === require.main){
  (async () => {
    const tumblr = new Tumblr()
  })()  
}