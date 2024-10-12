const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const dayjs = require('dayjs');  // 用于日期格式化
const path = require('path');
const cheerio = require('cheerio'); // 用于 HTML 解析

class Yahoo {
  constructor({ rssUrl, sheetName }) {
    this.rssUrl = rssUrl;
    this.sheetName = sheetName;
  }

  async getArticlesFromRss() {
    try {
      // 获取 RSS feed
      const response = await axios.get(this.rssUrl);
      const rssText = response.data;

      // 将 RSS XML 转换为 JavaScript 对象
      const rssJson = await parseStringPromise(rssText);

      // 提取文章列表
      const articles = rssJson.rss.channel[0].item.map(item => {
        let imgUrl = '';
        let orgImgUrl = '';

        // 检查是否有内容并提取图片链接
        if (item['content:encoded'] && item['content:encoded'][0]) {
          const match = item['content:encoded'][0].match(/<img src="([^"]+)"/);
          if (match && match[1]) {
            imgUrl = match[1];
            orgImgUrl = imgUrl.replace(/\/res\/.*\/https/, 'https');
          }
        }

        // 格式化 pubDate
        const pubDate = dayjs(item.pubDate[0]).format('YYYY-MM-DD HH:mm:ss');
        const guid = item.guid[0]._;

        return {
          productId: guid,
          title: item.title[0],
          link: item.link[0],
          description: item.description[0],
          pubDate: pubDate,
          previewImgUrl: imgUrl,  // 添加 imgUrl 属性
          orgImgUrl: orgImgUrl, // 原始图片链接
          guid: guid,  // 添加 guid
          category: item.category ? item.category[0] : 'Uncategorized'  // 添加 category
        };
      });

      console.log(articles);
      return articles;
    } catch (error) {
      console.error('Error fetching or parsing RSS feed:', error);
    }
  }

  // 添加文章到googlesheet
  async addArticlesToGoogleSheet(articles) {
    const GoogleSheet = require('./GoogleSheet');
    const gSheet = new GoogleSheet({ sheetName: this.sheetName });
    await gSheet.addSheetDatas({ datas: articles });
  }

  // 获取google文章内容
  async getArticleContent(article) {
    const { link } = article;

    try {
      const response = await axios.get(link);
      const html = response.data;
      const $ = cheerio.load(html);
      const content = $('.caas-body').text();

      console.log('Article content:', content);
      return content;
    } catch (error) {
      console.error('Error fetching article content:', error);
    }
  }

  // 获取google sheet中所有记录
  async getArticlesInSheet(){
    const GoogleSheet = require('./GoogleSheet');
    const gSheet = new GoogleSheet({ sheetName: this.sheetName });
    const articles = await gSheet.getAllDatas({})
    return articles
  }

  // 抓取最新文章发布到twitter
  async postNewArticleToTwitter(){
    const articles = await this.getArticlesFromRss()
    const articlesInSheet = await this.getArticlesInSheet()
    console.log({articlesInSheet})
    const sheetProductIds = articlesInSheet.map(n => n.productId)
    let newArticle = articles.find(n => {
      return !sheetProductIds.includes(n.productId)
    })

    if(!newArticle){
      console.log('没有新文章')
      return false
    }

    // 或者文章内容
    const content = await this.getArticleContent(newArticle)

    // 概括文章
    const HugAi = require('./HugAi.js')
    const hugAi = new HugAi()
    const summary = await hugAi.summary(content)

    // 生成ai图片
    const ImgAi = require('./ImgAi.js');
    const imgAi = new ImgAi()
    const imageBuffer = await imgAi.createImg({prompt: summary})
    if(!imageBuffer){
      return
    }
    const imgUrl = await imgAi.upload(imageBuffer)

    // 下载原图
    const Imgur = require('./Imgur.js')
    const imgur = new Imgur()
    const imgPath = path.relative(__dirname, '../temp/temp_img_down_from_yahoo.jpeg')
    const isSuccess = await imgur.downloadImage(newArticle.orgImgUrl, imgPath)
    if(!isSuccess){
      console.log({'下载原图失败': newArticle.orgImgUrl})
      return
    }

    // const Twitter = require('./Twitter.js')
    // const twitter = new Twitter()
    // const res = twitter.createPost({text: summary, imgPath})

    // 将文章记录到google sheet
    newArticle = {
      ...newArticle,
      subCont: summary,
      imgUrl,
    }
    this.addArticlesToGoogleSheet([newArticle])
  }
}

module.exports = Yahoo;

if (module === require.main) {
  let rssUrl = 'https://sports.yahoo.com/nba/rss/';
  const yahoo = new Yahoo({ rssUrl, sheetName: 'yahoo_nba' });
  // yahoo.getArticlesFromRss();
  yahoo.postNewArticleToTwitter()
}
