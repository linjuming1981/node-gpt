const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const dayjs = require('dayjs');  // 用于日期格式化

class Yahoo {
  constructor({ rssUrl, sheetName }) {
    this.rssUrl = rssUrl;
    this.sheetName = sheetName
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
          imgUrl: imgUrl,  // 添加 imgUrl 属性
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

  async addArticlesToGoogleSheet(articles) {
    const GoogleSheet = require('./GoogleSheet')
    const gSheet = new GoogleSheet({sheetName: this.sheetName})
    gSheet.addSheetDatas({datas: articles})
  }
}

module.exports = Yahoo;  

if (module === require.main) {
  let rssUrl = 'https://sports.yahoo.com/nba/rss/';
  const yahoo = new Yahoo({ rssUrl, sheetName });
  yahoo.getArticlesFromRss();
}
