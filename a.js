const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function uploadImageToImgur(filePath) {
    const clientId = 'YOUR_IMGUR_CLIENT_ID'; // 替换为你的 Imgur 客户端 ID
    const image = fs.createReadStream(filePath); // 读取本地图片文件

    const form = new FormData();
    form.append('image', image);

    try {
        const response = await axios.post('https://api.imgur.com/3/upload', form, {
            headers: {
                'Authorization': `Client-ID ${clientId}`,
                ...form.getHeaders()
            }
        });

        // 检查响应结果并获取图片链接
        if (response.data.success) {
            console.log('Image uploaded successfully:', response.data.data.link);
            return response.data.data.link;
        } else {
            console.error('Failed to upload image:', response.data);
        }
    } catch (error) {
        console.error('Error uploading image:', error.message);
    }
}

// 使用路径上传图片
uploadImageToImgur('path/to/your/image.jpg');
