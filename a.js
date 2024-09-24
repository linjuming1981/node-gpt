const fs = require('fs');
const fetch = require('node-fetch'); // 确保安装 node-fetch

async function query(data) {
  const response = await fetch("https://api-inference.huggingface.co/models/suno/bark", {
    headers: {
      Authorization: "Bearer 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",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.buffer(); // 获取缓冲区
  console.log(1111, result)
  return result;
}

query({"inputs": "The answer to the universe is 42"})
  .then((audioBuffer) => {
    fs.writeFile('audio.wav', audioBuffer, (err) => {
      if (err) {
        console.error('Error writing file', err);
      } else {
        console.log('Audio saved as audio.wav');
      }
    });
  })
  .catch((error) => {
    console.error('Error fetching audio', error);
  });
