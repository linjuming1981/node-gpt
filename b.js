const axios = require('axios');

async function callHuggingFaceAPI(prompt) {
  const apiUrl = 'https://api-inference.huggingface.co/models/XLabs-AI/flux-lora-collection';
  const apiKey = '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';  // 替换为你的 Hugging Face API 密钥

  try {
    const response = await axios.post(
      apiUrl,
      {
        inputs: prompt,  // 仅包含输入文本
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(`Error calling Hugging Face API: ${error.response ? error.response.statusText : error.message}`);
    throw error;
  }
}

callHuggingFaceAPI("A futuristic city skyline at sunset")
  .then(result => console.log("Generated Text:", result))
  .catch(err => console.error("Error:", err));
