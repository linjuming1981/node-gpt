// Consumer Keys
// - API Key: GnmPjOvbpvIHf8N0ggAeDAY0i
// - API Key Secret: sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7

// Authentication Tokens
// - Bearer Token: AAAAAAAAAAAAAAAAAAAAAKnLvgEAAAAAe6u2h5K9KNMLS049UtCzsxaYpSA%3DLsGgBCsfiIIRrEaZkxfbuNwTV1z4gKBkFOtKHmKtIZ8miKzkSA
// - Access Token: 420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe
// - Access Token Secret: 7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI

// OAuth 2.0 Client ID and Client Secret
// - Client ID : dHdLRzhleUo2aDlrcDh1bUlKM206MTpjaQ
// - Client Secret: Bz5tAWxstfF-HyuF3S6qQLtGF-2_LUD1a__3zvCup6_wk_Sa22




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


