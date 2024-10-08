const axios = require('axios');

// NewsBlur API 基础 URL
const NEWSBLUR_API_URL = 'https://newsblur.com/api';

const USERNAME = 'linjuming'; 
const PASSWORD = 'lin@5485246';

// 获取访问令牌
async function getAccessToken() {
    try {
        const response = await axios.post(`${NEWSBLUR_API_URL}/login`, {
            username: USERNAME,
            password: PASSWORD
        });

        console.log(2222, response.data)
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error);
    }
}

// 获取特定订阅的文章列表
async function getArticles(feedId, accessToken) {
    try {
        const response = await axios.get(`${NEWSBLUR_API_URL}/reader/feed/${feedId}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const articles = response.data;
        console.log(`Articles in feed ${feedId}:`);
        articles.news_items.forEach(item => {
            console.log(`Title: ${item.title}`);
            console.log(`Link: ${item.url}`);
            console.log(`Content: ${item.content}`);
            console.log('--------------------------');
        });
    } catch (error) {
        console.error('Error fetching articles:', error);
    }
}

// 主函数
async function main() {
    const { access_token } = await getAccessToken();
    const feedId = '23719';  // 替换为你要获取文章的订阅 ID

    await getArticles(feedId, access_token);
}

main();
