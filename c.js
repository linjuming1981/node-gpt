const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// 设置你的 API 密钥和访问令牌
const apiKey = 'GnmPjOvbpvIHf8N0ggAeDAY0i';
const apiSecretKey = 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7';
const accessToken = '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe';
const accessTokenSecret = '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI';

// 创建 OAuth 1.0a 实例
const oauth = OAuth({
  consumer: { key: apiKey, secret: apiSecretKey },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

// 发帖到 Twitter
async function postToTwitter(content) {
  const url = 'https://api.twitter.com/2/tweets';
  const requestData = {
    text: content,
  };

  try {
    // 为 OAuth 签名准备请求数据
    const request = {
      url,
      method: 'POST',
      data: requestData,
    };

    const headers = oauth.toHeader(oauth.authorize(request, {
      key: accessToken,
      secret: accessTokenSecret,
    }));

    // 发送 POST 请求
    const response = await axios.post(url, requestData, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    });

    console.log('Tweet posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response ? error.response.data : error.message);
  }
}

// 调用函数发帖
postToTwitter('Hello, World! This is a post from my Node.js app.');