const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');

// 替换为您的API密钥和令牌
const client = new TwitterApi({
  appKey: 'GnmPjOvbpvIHf8N0ggAeDAY0i',
  appSecret: 'sTjRupEtH5CnZNliOyzH8hkxatZS2Kxp3TCXTmK00JWDgy1Hm7',
  accessToken: '420767326-kDd7iYAfc7gWmBAe6klHAZV3nLG3g1VHHa2rWRAe',
  accessSecret: '7xj35VWwEr7McM42t4fdXskFxGToCKJ6wWV6cXvMjwBCI',
});

// 下载图片到本地
async function downloadImage(imgUrl, filePath) {
  const response = await axios({
    url: imgUrl,
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

// 发帖并附上图片
async function postTweetWithImage() {
  try {
    const imgUrl = 'https://i.imgur.com/j9B0am3.jpeg'; // Imgur图片URL
    const imagePath = path.resolve(__dirname, 'image.jpeg'); // 保存图片的路径

    // 下载图片
    await downloadImage(imgUrl, imagePath);

    // 上传图片到Twitter
    const mediaId = await client.v1.uploadMedia(imagePath);

    // 发布带图片的推文
    const { data } = await client.v2.tweet({
      text: 'Check out this image!',
      media: {
        media_ids: [mediaId],
      },
    });

    console.log('Tweet posted:', data.text);

    // 删除本地文件
    fs.unlinkSync(imagePath);
  } catch (error) {
    console.error('Error posting tweet:', error);
  }
}

postTweetWithImage();
