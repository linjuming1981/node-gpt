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
const Util = require('./Util.js')

class Twitter {
  constructor(){
    this.appKey = 'GnmPjOvbpvIHf8N0ggAeDAY0i'
    this.appSecret = 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7'
    this.accessToken = '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe'
    this.accessSecret = '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI'
    this.client = this.getClient()
  }

  getClient(){
    const { TwitterApi } = require('twitter-api-v2');
    // 替换成你自己的 API 密钥和令牌
    const client = new TwitterApi({
      appKey: this.appKey,
      appSecret: this.appSecret,
      accessToken: this.accessToken,
      accessSecret: this.accessSecret,
    });
    return client
  }

  async createPost({title, text, bloggerPostUrl, imgUrl}){

    // 加入标题和链接
    const link = `... ${bloggerPostUrl}`

    // 截取文本
    const truncatedText = Util.truncateText(text, 280, link);

    const postData = {
      text: truncatedText,
    }

    // 上传图片到 twitter
    if(imgUrl){
      const imgur = new Imgur()
      const imgPath = path.resolve(__dirname, '../temp/temp_img.jpeg')
      await imgur.downloadImage(imgUrl, imgPath)
      const mediaId = await this.client.v1.uploadMedia(imgPath)
      postData.media ||= {}
      postData.media.media_ids ||= []
      postData.media.media_ids.push(mediaId)
      fs.unlinkSync(imgPath)
    }

    const tweet = await client.v2.tweet(postData)
    console.log('Twitter推文已生成：', tweet)
    return tweet
  }

  async replyPost({tweetId, replyText, imgUrl}) {
    try {
      const postData = {
        text: replyText,
        in_reply_to_status_id: tweetId,  // 指定要回复的推文ID
      };

      // 上传图片到 twitter（如果提供了图片）
      if (imgUrl) {
        const imgur = new Imgur();
        const imgPath = path.resolve(__dirname, '../temp/temp_img_reply.jpeg');
        await imgur.downloadImage(imgUrl, imgPath);
        const mediaId = await this.client.v1.uploadMedia(imgPath);
        postData.media ||= {};
        postData.media.media_ids ||= [];
        postData.media.media_ids.push(mediaId);
        fs.unlinkSync(imgPath);
      }

      // 发布回复
      const tweet = await this.client.v2.reply(replyText, tweetId, {
        media: {
          media_ids: postData.media?.media_ids || [],
        },
      });

      console.log('Reply posted successfully:', tweet);
      return tweet;
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  }

}

module.exports = Twitter

if(module === require.main){
  (async () => {
    const twitter = new Twitter()
    // await twitter.createPost({
    //   text: 'The night was deep and pitch-black, rendering the landscape invisible.',
    //   imgUrl: 'https://i.imgur.com/DHggfzN.jpeg',
    // })

    await twitter.replyPost({
      tweetId: '1833768406891548829',
      replyText: 'very good',
      imgUrl: 'https://i.imgur.com/DHggfzN.jpeg'
    })

  })()
}


