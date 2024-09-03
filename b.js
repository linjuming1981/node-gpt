const axios = require('axios');
const fs = require('fs');

async function query(data) {
  try {
    // 发起 POST 请求
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/latent-consistency/lcm-lora-sdxl',
      data,
      {
        headers: {
          Authorization: 'Bearer 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',  // 替换为你的 Hugging Face API 密钥
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'  // 使用 arraybuffer 处理二进制数据
      }
    );

    // 将响应数据写入文件
    fs.writeFile('output.png', Buffer.from(response.data), (err) => {
      if (err) {
        console.error('Error saving image:', err);
      } else {
        console.log('Image saved as output.png');
      }
    });
  } catch (error) {
    console.error('Error calling Hugging Face API:', error);
  }
}

// 调用函数
query({ inputs: 'Astronaut riding a horse' });
