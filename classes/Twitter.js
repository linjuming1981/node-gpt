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
const Accounts = require('./TwitterAccounts.js');

class Twitter {
  constructor(mail = 'hello_abc1@gongjua.com'){
    for(let i in Accounts[mail]){
      this[i] = Accounts[mail][i]
    }

    console.log(1111122222, {
      appKey: this.appKey,
      appSecret: this.appSecret,
      accessToken: this.accessToken,
      accessSecret: this.accessSecret,
    })
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

  async createPost({title, text, bloggerPostUrl, imgUrl, imgPath}){
    // 加入标题和链接
    // const link = `... ${bloggerPostUrl}`
    const link = '...' // 带外链会被封杀
    
    // 截取文本
    const truncatedText = Util.truncateText(text, 280, link);
    
    const postData = {
      text: truncatedText,
    }

    if(imgUrl && !imgPath){
      const imgur = new Imgur()
      imgPath = path.resolve(__dirname, '../temp/temp_img.jpeg')
      await imgur.downloadImage(imgUrl, imgPath)
    }

    // 上传图片到 twitter
    if(imgPath){
      const mediaId = await this.client.v1.uploadMedia(imgPath)
      postData.media ||= {}
      postData.media.media_ids ||= []
      postData.media.media_ids.push(mediaId)
      fs.unlinkSync(imgPath)
    }

    const tweet = await this.client.v2.tweet(postData)
    console.log('Twitter推文已生成：', tweet)
    return tweet
  }

  async replyPost({tweetId, replyText, imgUrl, imgBuffer}) {
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

      // 处理 imgBuffer 上传
      if (imgBuffer) {
        const tempFilePath = path.resolve(__dirname, '../temp/temp_img_reply_buffer.jpeg');
        fs.writeFileSync(tempFilePath, imgBuffer);
        const mediaId = await this.client.v1.uploadMedia(tempFilePath);
        postData.media ||= {};
        postData.media.media_ids ||= [];
        postData.media.media_ids.push(mediaId);
        fs.unlinkSync(tempFilePath); // 上传后删除临时文件
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

  // 根据prompt生产图图片，使用gpt生成内容进行回复
  async aiReplyPost({postId, replyCont, imgPrompt}){
    const ImgAi = require('./ImgAi.js')
    const imgAi = new ImgAi()
    const imgBuffer = await imgAi.createImg({prompt: imgPrompt})

    const res = await this.replyPost({tweetId: postId, replyText: replyCont, imgBuffer})
    console.log('aiReplyPost', res);
    return res
  }


  // 权限不够，升级账号到基础账号才行，要100美元每月
  async getTrendsPosts(keyword) {
    try {
      // 搜索推文，查询关键词并指定最大返回数量
      const searchResults = await this.client.v2.search(keyword, {
        max_results: 10,  // 最大返回数量
        'tweet.fields': 'created_at', // 请求推文字段，例如创建时间
        'expansions': 'author_id', // 请求额外数据，例如作者ID
      });
  
      // 处理并打印搜索结果
      const tweets = searchResults.data;
      
      if (!tweets) {
        console.log('No tweets found for the given keyword.');
        return [];
      }
  
      // 获取帖子ID和文本内容
      const results = tweets.map(tweet => ({
        id: tweet.id,
        text: tweet.text,
      }));
  
      console.log('Trending Posts:', results);
      return results;
    } catch (error) {
      console.error('Error fetching trending posts:', error);
      return [];
    }
  }

  async getTweetReplies(tweetId){
    try {
      // 获取回复
      const replies = await this.client.v2.search({
        query: `conversation_id:${tweetId}`,
        max_results: 5, // 每次请求的最大结果数
        'tweet.fields': 'author_id,created_at,in_reply_to_user_id',
        'user.fields': 'name,username',
        expansions: 'author_id',
      });
  
      // 处理回复
      for await (const tweet of replies) {
        console.log(`Reply from ${tweet.author_id}: ${tweet.text}`);
      }
    } catch (error) {
      console.error('Error:', error);
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

    // await twitter.replyPost({
    //   tweetId: '1833768406891548829',  // 我自己的帖子 https://x.com/linjuming_1/status/1833768406891548829
    //   replyText: 'very good',
    //   imgUrl: 'https://i.imgur.com/DHggfzN.jpeg'
    // })

    // await twitter.aiReplyPost({
    //   postId: '1833768406891548829',
    //   replyCont: 'very good !',
    //   imgPrompt: 'Illustrate a comedic debate scene where two characters are arguing passionately.'
    // })

    await twitter.getTweetReplies('1837988517659500566')

  })()
}


