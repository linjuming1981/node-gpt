const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function query(data) {
  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/suno/bark",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer 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",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      console.log(response)
    }

    const audioBuffer = await response.buffer(); // 获取音频缓冲数据

    // 将音频文件保存到本地
    const filePath = path.join(__dirname, 'output.wav');
    fs.writeFileSync(filePath, audioBuffer);
    console.log(`音频已保存至 ${filePath}`);
  } catch (error) {
    console.error("错误:", error);
  }
}

query({"inputs": "hello world"});
