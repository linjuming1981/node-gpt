const axios = require('axios');
const fs = require('fs');

async function query(data) {
  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/XLabs-AI/flux-lora-collection',
      data,
      {
        headers: {
          Authorization: 'Bearer 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',  // 替换为你的 Hugging Face API 密钥
          'Content-Type': 'application/json'
        },
        responseType: 'blob'  // 确保响应作为 Blob 返回
      }
    );

    // 将 Blob 作为文件保存到本地（可选）
    const writer = fs.createWriteStream('output.png');
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log('Image saved as output.png');
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

query({ inputs: 'Astronaut riding a horse' });
