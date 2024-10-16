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
        responseType: 'blob', // 将响应类型设置为 blob 来处理二进制数据
      }
    );

    return response.data; // 返回 blob 数据  
  } catch (error) {
    console.error('Error querying the API:', error);
    return null;
  }
}

query({ "inputs": "Astronaut riding a horse" }).then((response) => {
  if (response) {
    // 处理图像的二进制数据
    console.log('Image blob received');
    // 在浏览器环境中可以将 blob 转换为 URL 以显示图片
    // const url = URL.createObjectURL(response);
    // img.src = url;
  } else {
    console.log('Failed to get image');
  }
});
