// api key: A6ObcfxZVoetRs19p2RucDFb6
// api secret: CbgTPyIvYPWF8iUdIiLkwNwHzK2CkZMKQ7X5ecZE95kXr07ZpB

// oauth2凭证
// Client ID： dHdLRzhleUo2aDlrcDh1bUlKM206MTpjaQ
// Client SECRECT: FuLvossJ_sqaQCNyF9JSt6iO4D-_QHZc7PtBnKb2sqAiUPN7F3
// Bearer Token: AAAAAAAAAAAAAAAAAAAAAKnLvgEAAAAA3%2FIq4TFmVwd0zLX5k%2BImuB8jwuc%3DobhNOOAh4ZkvBU8suneOwI5OOnWIQAHaXifTZUmF9ujSkUNu2p


class Twitter {
  constructor(){
    this.appKey = 'A6ObcfxZVoetRs19p2RucDFb6'
    this.appSecret = 'CbgTPyIvYPWF8iUdIiLkwNwHzK2CkZMKQ7X5ecZE95kXr07ZpB'
    this.accessToken = '420767326-FqeiNTaogrv8emHieBqICtAMJ6joOCIrg1SYLxLD'
    this.accessSecret = 'lPw412aWdWmq4gdxxOtlSdNwek9uFTSE2Itr4GXHfu70E'
  }

  async createPost(){
    const { TwitterApi } = require('twitter-api-v2');

    // 替换成你自己的 API 密钥和令牌
    const client = new TwitterApi({
      appKey: this.appKey,
      appSecret: this.appSecret,
      accessToken: this.accessToken,
      accessSecret: this.accessSecret,
    });

    // 发送一个推文
    try {
      const tweet = await client.v1.tweet('Hello, world! This is a tweet from Node.js');
      console.log('Tweet sent:', tweet);
    } catch (error) {
      console.error('Error sending tweet:', error);
    }
  }
}

module.exports = Twitter

if(module === require.main){
  (async () => {
    const twitter = new Twitter()
    await twitter.createPost()

  })()
}


