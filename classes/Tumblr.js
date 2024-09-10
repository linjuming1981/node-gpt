const tumblr = require('tumblr.js');
const open = require('open');

let requestToken, requestTokenSecret;

class Tumblr {
  constructor(){
    this.OAuth_Consumer_Key = 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik'
    this.Secret_Key = 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI'
    this.client = this.getClient()
  }

  getClient(){
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