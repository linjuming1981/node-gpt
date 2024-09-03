const axios = require('axios');

// 替换为你的 Hugging Face API Token
const API_TOKEN = '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';

// 设置请求的参数
const data = {
  "inputs": "A beautiful sunset over the mountains",  // 你的提示词
  "options": {
    "use_cache": false,
  }
};

// 调用 API
axios({
  method: 'post',
  url: 'https://api-inference.huggingface.co/models/XLabs-AI/flux-lora-collection',
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json',
  },
  data: JSON.stringify(data),
})
.then(function (response) {
  console.log("生成的图像链接:", response.data.data[0].url);  // 根据返回的格式调整
})
.catch(function (error) {
  console.log("请求失败:", error);
});