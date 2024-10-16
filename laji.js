const axios = require('axios');

async function query(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/alimama-creative/FLUX.1-Turbo-Alpha',
      data,
      {
        headers: {
          Authorization: 'Bearer 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', // 替换为你的 Hugging Face API 密钥
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data; // 返回响应数据
  } catch (error) {
    console.error('查询 API 时出错:', error);
    return null;
  }
}

// 调用示例
query({ "inputs": "Astronaut riding a horse" }).then((response) => {
  if (response) {
    console.log('接收到的响应:', response);
  } else {
    console.log('获取图像失败');
  }
});