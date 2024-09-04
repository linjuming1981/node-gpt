const axios = require('axios');

// 1. 设置 Bearer Token
const bearerToken = 'AAAAAAAAAAAAAAAAAAAAAKnLvgEAAAAAe6u2h5K9KNMLS049UtCzsxaYpSA%3DLsGgBCsfiIIRrEaZkxfbuNwTV1z4gKBkFOtKHmKtIZ8miKzkSA';

// 2. 发帖到 X.com 使用 API v2
async function postToX(content) {
  const url = 'https://api.twitter.com/2/tweets';
  const data = { text: content }; // v2 使用 `text` 字段

  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,  // 使用Bearer Token进行认证
        'Content-Type': 'application/json',
      },
    });

    console.log('Tweet posted successfully:', response.data);
  } catch (error) {
    console.error('Error posting tweet:', error.response ? error.response.data : error.message);
  }
}

// 3. 调用函数发帖
postToX('Hello, World! This is a post from my Node.js app.');
