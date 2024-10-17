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
    this.client = this.getClient()
  }

  // 获取随机一个tag
  static getRadomTag() {
    const trendingTags = require('./TwitterTags.js');
    const allTags = Object.values(trendingTags)
      .join(',')
      .split(',');
  
    // 随机抽取一个标签
    const randomIndex = Math.floor(Math.random() * allTags.length);
    return allTags[randomIndex];
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

  async createPost({title, text, bloggerPostUrl, imgUrl, imgPath, tags}){
    // 加入标题和链接
    // const link = `... ${bloggerPostUrl}`
    const link = '...' // 带外链会被封杀 

    if (tags && tags.length > 0) {
      // 随机抽取2个tag
      const selectedTags = tags.sort(() => 0.5 - Math.random()).slice(0, 2);
      const tagText = selectedTags.map(tag => `#${tag}`).join(' ');
      text = `${tagText} ${text}`;
    }
    
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

  // 搜索用户，接口文档：https://developer.x.com/en/docs/x-api/users/lookup/api-reference/get-users-by-username-username#tab1
  async searchUser(username) {
    try {
      const options = {
        "user.fields": [
            "affiliation",
            "connection_status",
            "created_at",
            "description",
            "entities",
            "id",
            "location",
            "most_recent_tweet_id",
            "name",
            "pinned_tweet_id",
            "profile_banner_url",
            "profile_image_url",
            "protected",
            "public_metrics",
            "receives_your_dm",
            "subscription_type",
            "url",
            "username",
            "verified",
            "verified_type",
            "withheld"
        ],
        "expansions": [
            "affiliation.user_id",
            "most_recent_tweet_id",
            "pinned_tweet_id"
        ],
        "tweet.fields": [
            "article",
            "attachments",
            "author_id",
            "card_uri",
            "context_annotations",
            "conversation_id",
            "created_at",
            "display_text_range",
            "edit_controls",
            "edit_history_tweet_ids",
            "entities",
            "geo",
            "id",
            "in_reply_to_user_id",
            "lang",
            "media_metadata",
            "non_public_metrics",
            "note_tweet",
            "organic_metrics",
            "possibly_sensitive",
            "promoted_metrics",
            "public_metrics",
            "referenced_tweets",
            "reply_settings",
            "scopes",
            "source",
            "text",
            "withheld"
        ]
      }

      // 调用 Twitter API 获取用户信息
      const user = await this.client.v2.userByUsername(username, options);
  
      // 检查用户是否存在
      if (user && user.data) {
        console.log('用户信息:', user);
        return user;
      } else {
        console.log('未找到该用户。');
        return null;
      }
    } catch (error) {
      console.error('获取用户信息时出错:', error);
      return null;
    }
  }

 
  

}

module.exports = Twitter

if(module === require.main){
  (async () => {
    const twitter = new Twitter()
    await twitter.searchUser('hello_abc_1')

  })()
}


