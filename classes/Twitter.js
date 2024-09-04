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


const fs = require('fs');
const path = require('path')
const Imgur = require('./Imgur.js')

class Twitter {
  constructor(){
    this.appKey = 'GnmPjOvbpvIHf8N0ggAeDAY0i'
    this.appSecret = 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7'
    this.accessToken = '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe'
    this.accessSecret = '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI'
  }

  async createPost({text, imgUrl}){
    const { TwitterApi } = require('twitter-api-v2');

    // 替换成你自己的 API 密钥和令牌
    const client = new TwitterApi({
      appKey: this.appKey,
      appSecret: this.appSecret,
      accessToken: this.accessToken,
      accessSecret: this.accessSecret,
    });

    const postData = {
      text,
    }

    // 上传图片到 twitter
    if(imgUrl){
      const imgur = new Imgur()
      const imgPath = path.resolve(__dirname, 'temp_img.jpeg')
      await imgur.downloadImage(imgUrl, imgPath)
      const mediaId = await client.v1.uploadMedia(imgPath)
      postData.media ||= {}
      postData.media.media_id ||= []
      postData.media.media_id.push(mediaId)
      fs.unlinkSync(imgPath)
    }

    const tweet = await client.v2.tweet(postData)
    console.log('Twitter推文已生成：', tweet)
    return tweet
  }
}

module.exports = Twitter

if(module === require.main){
  (async () => {
    const twitter = new Twitter()
    await twitter.createPost({
      // text: 'The night was deep and pitch-black, rendering the landscape invisible. Yet the mountains were far from tranquil; wild beasts roared, shaking the mountains and rivers, while countless trees trembled and leaves fell in a rustling cascade.Among the countless mountains and ravines, ancient feral beasts roamed, primordial species emerged, and terrifying sounds echoed in the darkness, threatening to tear apart the heavens and earth.In the mountains, from a distance, a soft light appeared, like a flickering candle amidst the boundless darkness and myriad peaks, seemingly on the verge of extinguishing at any moment.As one drew closer, a massive charred tree trunk became visible, with a diameter of several meters. Apart from the half of the trunk, only a slender, vibrant branch remained, adorned with jade-green leaves that emitted a gentle glow, casting a protective light over a village.Specifically, this was a Thunderstruck Tree. Many years ago, it had been struck by a lightning bolt that reached the heavens, destroying the massive crown and vibrant life of the old willow.'
      text: 'The night was deep and pitch-black, rendering the landscape invisible'
    })

  })()
}


