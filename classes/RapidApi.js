const axios = require('axios')
const Util = require('./Util.js')

class RapidApi{
  constructor(){

  }

  getApiKey(){
    const apiKeys = {
      'linjuming@gmail.com': '4a8ab52526msh8046b902b12588cp199e12jsnb0e2e078aeaf',
      'mingfish1@126.com': 'db197dae92msh038d1f762111b0cp1d6d51jsn812bba5dbc6f',
    }
    const apiKey = Util.getObjRandItem(apiKeys)
    return apiKey
  }

  // 调试地址： https://rapidapi.com/restocked-gAGxip8a_/api/twitter-api47/playground/apiendpoint_d9a2ab0a-aaad-45e1-a9fe-8d6db286f0b4
  async searchTwitterPosts({keyword}){
    const apiKey = this.getApiKey()
    console.log('searchTwitterPosts使用apiKey', apiKey)
    
    const options = {
      method: 'GET',
      url: 'https://twitter-api47.p.rapidapi.com/v2/search',
      params: {
        query: keyword,
        type: 'Top'
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'twitter-api47.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      // console.log(response.data);

      const list = []
      response.data.tweets.forEach(n => {
        if(n.legacy){
          const item = {
            user_id: n.legacy.user_id_str,
            id: n.legacy.id_str, // 帖子id
            full_text: n.legacy.full_text, // 帖子文本内容
            created_at: Util.getDateTime(n.created_at),
          }
          list.push(item)
        }
      })
      return list;

      // return response.data
    } catch (error) {
      console.error('searchTwitterPosts', error);
      return false
    }

  }
}

module.exports = RapidApi

if(module === require.main){
  (async() => {
    const rapidApi = new RapidApi()
    const list = await rapidApi.searchTwitterPosts({keyword: 'NBA'})
    console.log(list)
  })();
}