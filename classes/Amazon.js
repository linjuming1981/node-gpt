const axios = require('axios');
const cheerio = require('cheerio');

class Amazon {
  async collectPage(url){
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
      }
    });
    // console.log(11, response.data);
    const $ = cheerio.load(response.data);
    
    // 这里你可以进一步解析页面内容，如获取标题,价格等：
    let title = $('#title').text().trim();
    console.log(222, title);

    // featurebullets_feature_div
    // aplus_feature_div
    // productDescription_feature_div
    // productDetails_feature_div
    let content = $('#bookDescription_feature_div').html()
    console.log(333, content)

    let img = $('#imgTagWrapperId').html()
    console.log(444, img)

  }
}

let amazon = new Amazon();
let url = 'https://www.amazon.com/dp/B006IE2IO8/'
amazon.collectPage(url)