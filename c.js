const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// 设置你的 API 密钥和访问令牌
const apiKey = 'GnmPjOvbpvIHf8N0ggAeDAY0i';
const apiSecretKey = 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7';
const accessToken = '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe';
const accessTokenSecret = '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI';

const { TwitterApi } = require('twitter-api-v2');

// 替换为您的 API 密钥和令牌
const client = new TwitterApi({
    appKey: 'GnmPjOvbpvIHf8N0ggAeDAY0i',
    appSecret: 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7',
    accessToken: '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe',
    accessSecret: '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI',
});

async function postTweet() {
    try {
        const { data } = await client.v2.tweet('Hello, Twitter!');
        console.log('Tweet posted:', data.text);
    } catch (error) {
        console.error('Error posting tweet:', error);
    }
}

postTweet();