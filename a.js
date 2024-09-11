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
          media: fs.createReadStream(path.resolve(__dirname, './output.png')),  
          // url: 'https://i.imgur.com/j9B0am3.jpeg',    
          alt_text: '…',
          attribution: {
            "type": "link",
            "url": "http://shahkashani.com/"
          }
        },
        {
          type: 'text',
          text: 'This is a sample post with an <a href="https://example.com">example link</a>'
        },
        {
          "type": "link",
          "url": "https://www.nytimes.com/2017/06/15/us/politics/secrecy-surrounding-senate-health-bill-raises-alarms-in-both-parties.html",
          "title": "Secrecy Surrounding Senate Health Bill Raises Alarms in Both Parties",
          "description": "Senate leaders are writing legislation to repeal and replace the Affordable Care Act without a single hearing on the bill and without an open drafting session.",
          "author": "Thomas Kaplan and Robert Pear",
          "poster": [
              {
                  "url": "https://static01.nyt.com/images/2017/06/15/us/politics/15dchealth-2/15dchealth-2-facebookJumbo.jpg",
                  "type": "image/jpeg",
                  "width": 1050,
                  "height": 549
              }
          ]
       }
      ],
    });
    console.log('Post created successfully');
  } catch (error) {
    console.error('Error creating post:', error);
  }
}

createPost();