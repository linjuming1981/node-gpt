const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function query(data) {
  try {
    // 发起 POST 请求
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      data,
      {
        headers: {
          Authorization: 'Bearer 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', // 替换为你的 Hugging Face API 密钥
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'  // 将响应数据类型设置为 arraybuffer 以处理二进制数据
      }
    );

    // 将二进制数据保存为文件（假设返回的是图像）
    const filePath = path.join(__dirname, 'output1.png');
    fs.writeFileSync(filePath, response.data);

    console.log('Image saved as output.png');
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
  }
}

// 调用函数并传递数据
const rand = Math.random(1)
const prompt = `Astronaut riding a horse (without cache ${rand})`
query({ inputs: prompt });
