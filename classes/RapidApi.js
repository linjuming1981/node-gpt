const axios = require('axios')

class RapidApi{
  constructor(){

  }

  async searchTwitterPosts({keyword}){
    const options = {
      method: 'GET',
      url: 'https://twitter-api47.p.rapidapi.com/v2/search',
      params: {
        query: keyword,
        type: 'Top'
      },
      headers: {
        'x-rapidapi-key': '4a8ab52526msh8046b902b12588cp199e12jsnb0e2e078aeaf',
        'x-rapidapi-host': 'twitter-api47.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data
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
    await rapidApi.searchTwitterPosts('NBA')
  })
}