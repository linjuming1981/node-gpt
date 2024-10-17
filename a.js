const axios = require('axios');

const apiKey = 'sk-qfAmhZx......';  // 你的 ChatGPT API 密钥
const apiUrl = 'https://api.chatanywhere.org/v1/chat/completions';  // 转发 Host URL

const requestData = {
  model: 'gpt-4o-mini',  // 根据你使用的模型选择
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'Hello, how are you?' }
  ]
};

axios.post(apiUrl, requestData, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`  // 将 API 密钥放入 Authorization 头中
  }
})
.then(response => {
  console.log('Response:', response.data);
  console.log('答案', response.data.choices[0].message)
})
.catch(error => {
  console.error('Error:', error);
});
