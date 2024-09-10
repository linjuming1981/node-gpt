const axios = require('axios');
const fs = require('fs')

const blogName = 'linjuming.tumblr.com';
const apiUrl = `https://api.tumblr.com/v2/blog/${blogName}/posts`;

// 读取图片文件
const imagePath = './temp/output.png';
const imageData = fs.readFileSync(imagePath);
// console.log(imageData) // 确定有数据    

const postData = {
  type: 'photo',
  caption: 'This is a photo post',
  tags: ['nodejs', 'tumblr'],
  data: [imageData]
};

const config = {
  params: {
    api_key: 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik'
  },
  headers: {
    'Content-Type': 'application/json'
  }
};

axios.post(apiUrl, postData, config)
  .then(response => {
    console.log(11111111)   
    console.log('Post created:', response.data.response.id);
  })
  .catch(error => {
    console.error('Error creating post:', error);
  });