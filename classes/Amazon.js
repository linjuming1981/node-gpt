const axios = require('axios');
const cheerio = require('cheerio');

class Amazon {
  async collectPage(url){
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
      }
    });
    // console.log(11, response);
    const $ = cheerio.load(response.data);
    
    // 标题
    let title = $('#productTitle').text().trim();
    console.log(title);
    
    // 功能清单
    let featurebullets = []
    $('#featurebullets_feature_div li').each((i, n) => {
      featurebullets.push($(n).text().trim())
    })
    
    return {
      title,
      featurebullets,
    }

  }
}

module.exports = Amazon;

// let amazon = new Amazon();
// let url = 'https://www.amazon.com/dp/B006IE2IO8/'
// amazon.collectPage(url)