const tumblr = require('tumblr.js');
const fs = require('fs');
const path = require('path');

const client = tumblr.createClient({
  consumer_key: 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik',
  consumer_secret: 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI',
  token: 'Gpr1j56qVORXdp7HZvWYICTqEVf1WsarXbJaLLRvfG85EaRkRM',
  token_secret: 'YoiZ4cFMdGxCXFlGj5b5vUdI6pLMR8fSjOEn0WdG0e6e2O7aSB'
});

const blogName = 'linjuming';  // 替换为你的博客名称

async function createPost() {
  try {
    await client.createPost(blogName, {
      content: [
        {
          type: 'image',
          // media: fs.createReadStream(path.resolve(__dirname, './output.png')),  
          url: 'https://i.imgur.com/j9B0am3.jpeg',
          alt_text: '…',
        },
        {
          type: 'text',
          text: 'This is a sample post with an <a href="https://example.com">example link</a>'
        }
      ],
    });
    console.log('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

createPost();