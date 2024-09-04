const axios = require('axios');
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// 1. 设置你的 API 密钥和访问令牌
const apiKey = 'GnmPjOvbpvIHf8N0ggAeDAY0i';
const apiSecretKey = 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7';
const accessToken = '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe';
const accessTokenSecret = '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI';

// 2. 创建 OAuth 1.0a 实例
const oauth = OAuth({
  consumer: { key: apiKey, secret: apiSecretKey },
  signature_method: 'HMAC-SHA1',
  hash_function(baseString, key) {
    return crypto.createHmac('sha1', key).update(baseString).digest('base64');
  },
});

const token = {
  key: accessToken,
  secret: accessTokenSecret,
};

// 3. 发帖到 X.com 使用 API v2
async function postToX(content) {
  const url = 'https://api.twitter.com/2/tweets';
  const requestData = {
    url,
    method: 'POST',
    data: { text: content }, // v2 使用 `text` 字段
  };

  try {
    const authHeader = oauth.toHeader(oauth.authorize(requestData, token));
    const response = await axios.post(url, requestData.data, {
      headers: {
        Authorization: authHeader.Authorization,  // 使用OAuth生成的认证头
        'Content-Type': 'application/json',      // 确保内容类型为 JSON
      },
    });

    console.log('Tweet posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response ? error.response.data : error.message);
  }
}

// 4. 调用函数发帖
postToX('Hello, World! This is a post from my Node.js app.');
