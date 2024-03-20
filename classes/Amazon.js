const axios = require('axios');
const cheerio = require('cheerio');

class Amazon {
  async collectPage(url){
    const response = await axios.get(url, {
      // headers: {
      //   // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36',
      //   // 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      //   // 'Host': 'www.amazon.com',
      //   authority : `www.amazon.com`,
      //   accept: `text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9`,
      //   'accept-language': `zh-CN,zh;q=0.9,en;q=0.8`,
      //   // cookie: `session-id=134-9090719-0323652; ubid-main=130-5461362-1770360; s_fid=54073F36B029408D-154A1404B5688AE3; sst-main=Sst1|PQGh-09oT65RGKsPWfl_wcUrB80VY4N66Oe7-KJ64Rw_7t_LDj7_v3UApyR3SEF7_JTaSy3ksjy0GyaaodsnbpyKzdxPq_UG-WZPb4DGBQatNTS6wTABmMnFwNViVgEkqe7bHx_vzFkxkqBsU8V1dPSq0UWx8dBUrlk-26FGgeFSt5w403uNJEuIwrRGvlFYkXPeOV-x-B1eFuoS9pNEGQRytO3LOtlIb7I9Md-ceGNkQAwcXiAFnF4tiW53usBfG_WD; session-id-time=2082787201l; i18n-prefs=USD; lc-main=en_US; session-token=eISlwPsRZWRvKzEiuA9hWC5PS5x3uzU5JWJJsa4Wc/PQCgi7OMU1KlT0+i/3T1i9n/O9fcJabIIZWkETDPvrsq/ZJW9o4M7mAjxJEFv/rWne8YLB4Fxum0OkeFMkXWQluVUr/K3GcKcKvCcpNhPW+ALPbqM1vMmM3Uc+snJcKfMUg0vY1nWaFn5e6AaHQOY4EJYQMydAYB4R97915ljLeXeMW9x8ijKeaM4ppL9RdvrNEGxt7SMf5vDf0lZKAo8m5JqAqaN9Omoy/sdewFr6QNRetb3OUXvfO2O3Clmuo2DnIfPG1HoPjiSZdS41pCXC36YWh4mR0PbXRnqHNFhko7gD+F8I2Uz3; skin=noskin; csm-hit=tb:s-0TRC8GEWX597JDKM3KVW|1710340995550&t:1710340998677&adb:adblk_no`,
      //   'device-memory':8,
      //   downlink:1.35,
      //   dpr: 1,
      //   ect:'3g',
      //   rtt: 400,
      //   'sec-ch-device-memory':8,
      //   'sec-ch-dpr':1,
      //   'sec-ch-ua':`"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"`,
      //   // 'sec-ch-ua-mobile': ?0,
      //   'sec-ch-ua-platform':"Windows",
      //   'sec-ch-ua-platform-version':"0.1.0",
      //   'sec-ch-viewport-width':1073,
      //   'sec-fetch-dest': 'document',
      //   'sec-fetch-mode':'navigate',
      //   'sec-fetch-site':'none',
      //   // 'sec-fetch-user':?1,
      //   'upgrade-insecure-requests':1,
      //   'viewport-width':1073,
      //   'user-agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
      // },
      "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "device-memory": "8",
        "downlink": "1.35",
        "dpr": "1",
        "ect": "3g",
        "rtt": "400",
        "sec-ch-device-memory": "8",
        "sec-ch-dpr": "1",
        "sec-ch-ua": "\"Not_A Brand\";v=\"99\", \"Google Chrome\";v=\"109\", \"Chromium\";v=\"109\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-ch-ua-platform-version": "\"0.1.0\"",
        "sec-ch-viewport-width": "1073",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "viewport-width": "1073",
        // "cookie": "session-id=134-9090719-0323652; ubid-main=130-5461362-1770360; s_fid=54073F36B029408D-154A1404B5688AE3; sst-main=Sst1|PQGh-09oT65RGKsPWfl_wcUrB80VY4N66Oe7-KJ64Rw_7t_LDj7_v3UApyR3SEF7_JTaSy3ksjy0GyaaodsnbpyKzdxPq_UG-WZPb4DGBQatNTS6wTABmMnFwNViVgEkqe7bHx_vzFkxkqBsU8V1dPSq0UWx8dBUrlk-26FGgeFSt5w403uNJEuIwrRGvlFYkXPeOV-x-B1eFuoS9pNEGQRytO3LOtlIb7I9Md-ceGNkQAwcXiAFnF4tiW53usBfG_WD; session-id-time=2082787201l; i18n-prefs=USD; lc-main=en_US; session-token=eISlwPsRZWRvKzEiuA9hWC5PS5x3uzU5JWJJsa4Wc/PQCgi7OMU1KlT0+i/3T1i9n/O9fcJabIIZWkETDPvrsq/ZJW9o4M7mAjxJEFv/rWne8YLB4Fxum0OkeFMkXWQluVUr/K3GcKcKvCcpNhPW+ALPbqM1vMmM3Uc+snJcKfMUg0vY1nWaFn5e6AaHQOY4EJYQMydAYB4R97915ljLeXeMW9x8ijKeaM4ppL9RdvrNEGxt7SMf5vDf0lZKAo8m5JqAqaN9Omoy/sdewFr6QNRetb3OUXvfO2O3Clmuo2DnIfPG1HoPjiSZdS41pCXC36YWh4mR0PbXRnqHNFhko7gD+F8I2Uz3; skin=noskin; csm-hit=tb:s-0TRC8GEWX597JDKM3KVW|1710340995550&t:1710340998677&adb:adblk_no"
      },


    })
    // .catch(err => console.log(err))

    console.log(11, response);
    return response.data

    // const $ = cheerio.load(response.data);
    
    // // 标题
    // let productTitle = $('#productTitle').text().trim();

    // // 书籍描述（书籍类型才有）
    // let bookDescription = $('#bookDescription_feature_div').text()
    
    // // 功能清单
    // let featurebullets = []
    // $('#featurebullets_feature_div li').each((i, n) => {
    //   featurebullets.push($(n).text().trim())
    // })
    
    // return {
    //   productTitle,
    //   bookDescription,
    //   featurebullets,
    // }

  }
}

module.exports = Amazon;

// (async () => {
//   let amazon = new Amazon();
//   let url = 'https://www.amazon.com/dp/B006IE2IO8/'
//   let res = await amazon.collectPage(url)
//   console.log(res)
// })();

// authority:www.amazon.com
// accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9
// accept-language:zh-CN,zh;q=0.9,en;q=0.8
// cache-control:max-age=0
// cookie:session-id=134-9090719-0323652; ubid-main=130-5461362-1770360; s_fid=54073F36B029408D-154A1404B5688AE3; sst-main=Sst1|PQGh-09oT65RGKsPWfl_wcUrB80VY4N66Oe7-KJ64Rw_7t_LDj7_v3UApyR3SEF7_JTaSy3ksjy0GyaaodsnbpyKzdxPq_UG-WZPb4DGBQatNTS6wTABmMnFwNViVgEkqe7bHx_vzFkxkqBsU8V1dPSq0UWx8dBUrlk-26FGgeFSt5w403uNJEuIwrRGvlFYkXPeOV-x-B1eFuoS9pNEGQRytO3LOtlIb7I9Md-ceGNkQAwcXiAFnF4tiW53usBfG_WD; session-id-time=2082787201l; i18n-prefs=USD; lc-main=en_US; session-token=pX/yrE1h2vhVZb3BJXE7me9nOdf8ocaRIqIdnMW6qj2jbD8IwppA0xtoDdp86VKJ1JkSICi53anOBFQICvL4QvDwR3bM/sDbJi29XnZbuXyLPbZ1euj1J88CPTDnRNC9ubBBe73SiGK8/s9kWk08MidNWEu3WEz3Vemri/2Dt/xT4c7FKFFjvjPp9zm6dpiAMNS0Lx/k5l7O44gCU1sx3XRoVpulFvKj3Dp/3kgVBRzGme5JRPucPino31WDMDK59oL8x9DbiYgl0s/015pwoa/wR3ISTO0JX7hZdShB7ugtMJrxLJB6oGXqjE05+MsZQ7m/86y24/UyrsTrJ6enEaVH01bVkchY; csm-hit=tb:DZT94H0ACKPJNS2WVEZV+s-91E2WW20EPSS1D0KQ862|1710259685973&t:1710259685973&adb:adblk_no
// device-memory:8
// downlink:1.25
// dpr:1
// ect:3g
// rtt:600
// sec-ch-device-memory:8
// sec-ch-dpr:1
// sec-ch-ua:"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"
// sec-ch-ua-mobile:?0
// sec-ch-ua-platform:"Windows"
// sec-ch-ua-platform-version:"0.1.0"
// sec-ch-viewport-width:1073
// sec-fetch-dest:document
// sec-fetch-mode:navigate
// sec-fetch-site:none
// sec-fetch-user:?1
// upgrade-insecure-requests:1
// user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36
// viewport-width:1073