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
        // {
        //   type: 'image',
        //   // media: fs.createReadStream(path.resolve(__dirname, './output.png')),  
        //   // url: 'https://i.imgur.com/j9B0am3.jpeg',  
        //   "url": "http://69.media.tumblr.com/b06fe71cc4ab47e93749df060ff54a90/tumblr_nshp8oVOnV1rg0s9xo1_1280.jpg",  
        //   "alt_text": "Sonic the Hedgehog and friends",
        //   "caption": "I'm living my best life on earth.",
        // },
        {
          "type": "image",
          "caption": "I'm living my best life on earth.",
          "media": [
              {
                  "type": "image/jpeg",
                  "url": "https://i.imgur.com/j9B0am3.jpeg",
                  "width": 1024,
                  "height": 1024
              }
          ]
        },
        {
          type: 'text',
          text: 'Senate leaders are writing legislation to Secrecy Surrounding Senate Health Bill Raises Alarms in Both Parties Senate Health Bill Raises Alarms in Both Parties Senate Health Bill Raises Alarms in Both Parties Senate Health Bill Raises Alarms in Both Parties'
        },
        {
          "type": "link",
          "url": "https://novel-focus.blogspot.com/2024/09/chapter-20-sudden-change.html",
          // "title": "Secrecy Surrounding Senate Health Bill Raises Alarms in Both Parties",
          "description": "",
          // "author": "Thomas Kaplan and Robert Pear",
          // "poster": [
          //     {
          //         "url": "https://i.imgur.com/j9B0am3.jpeg",
          //         "type": "image/jpeg",
          //         "width": 1024,
          //         "height": 1024
          //     }
          // ]
       }
      ],
    });
    console.log('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

createPost();