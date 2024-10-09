const axios = require('axios');
const { parseStringPromise } = require('xml2js');

class Yahoo {
  constructor({ rssUrl }) {
    this.rssUrl = rssUrl;
  }

  async getArticlesFromRss() {
    try {
      // 获取 RSS feed
      const response = await axios.get(this.rssUrl);
      const rssText = response.data;

      // 将 RSS XML 转换为 JavaScript 对象
      const rssJson = await parseStringPromise(rssText);

      // 提取文章列表，并提取文章中的图片链接
      const articles = rssJson.rss.channel[0].item.map(item => {
        let imgUrl = '';

        // 检查是否有内容并提取图片链接
        if (item['content:encoded'] && item['content:encoded'][0]) {
          const match = item['content:encoded'][0].match(/<img src="([^"]+)"/);
          if (match && match[1]) {
            imgUrl = match[1];
          }
        }

        return {
          title: item.title[0],
          link: item.link[0],
          description: item.description[0],
          pubDate: item.pubDate[0],
          imgUrl: imgUrl  // 添加 imgUrl 属性
        };
      });

      console.log(articles);
      return articles;
    } catch (error) {
      console.error('Error fetching or parsing RSS feed:', error);
    }
  }
}

module.exports = Yahoo;  

if (module === require.main) {
  let rssUrl = 'https://sports.yahoo.com/nba/rss/';
  const yahoo = new Yahoo({ rssUrl });
  yahoo.getArticlesFromRss();
}
