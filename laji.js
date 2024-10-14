const axios = require('axios');

async function test(){
    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://twitter-api45.p.rapidapi.com/search.php',
      params: {
        query: 'nba',
        search_type: 'Top'
      },
      headers: {
        'x-rapidapi-key': '4a8ab52526msh8046b902b12588cp199e12jsnb0e2e078aeaf',
        'x-rapidapi-host': 'twitter-api45.p.rapidapi.com'
      }
    };
    
    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

test()