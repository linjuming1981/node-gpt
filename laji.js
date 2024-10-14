const axios = require('axios');

// 替换为您的 Bearer Token
const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAHB2wQEAAAAA45RVKnoO9sN7HRQRBtdg74N4YhQ%3DAOmmQTrA8RD3kBSrI299FqcWXekKhgtFVXLj48ASwGOJVdBuid';

// 函数：获取用户的推文
async function getUserTweets(userId, maxResults = 5) {
    const url = `https://api.twitter.com/2/users/${userId}/tweets?max_results=${maxResults}&tweet.fields=created_at`;

    try {
        const response = await axios.get(url, {
            headers: {
                'Authorization': `Bearer ${BEARER_TOKEN}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching tweets:', error.response ? error.response.data : error.message);
    }
}

// 示例：获取指定用户的推文
const userId = 'USER_ID'; // 替换为目标用户的 ID
getUserTweets(userId)
    .then(tweets => {
        console.log('Fetched tweets:', tweets);
    });