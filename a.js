const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function query(data) {
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/microsoft/speecht5_tts",
      data,
      {
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        responseType: 'arraybuffer' // 处理二进制数据
      }
    );
    
    // 将音频文件保存到本地
    const filePath = path.join(__dirname, 'output.wav');
    fs.writeFileSync(filePath, response.data);
    console.log(`音频已保存至 ${filePath}`);
  } catch (error) {
    console.error("错误:", error);
  }
}

query({"inputs": "The answer to the universe is 42"});
