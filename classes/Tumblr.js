const tumblr = require('tumblr.js');

class Tumblr {
  constructor(){
    this.OAuth_Consumer_Key = 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik'
    this.Secret_Key = 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI'
    this.client = this.getClient()
  }

  getClient(){
    // 通过 https://www.tumblr.com/oauth/apps -> Explore API工具生成
    const client = tumblr.createClient({
      consumer_key: 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik',
      consumer_secret: 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI',
      token: 'Gpr1j56qVORXdp7HZvWYICTqEVf1WsarXbJaLLRvfG85EaRkRM',
      token_secret: 'YoiZ4cFMdGxCXFlGj5b5vUdI6pLMR8fSjOEn0WdG0e6e2O7aSB'
    });
    return client  
  }  



}

module.exports = Tumblr

if(module === require.main){
  (async () => {
    const tumblr = new Tumblr()
  })()  
}
