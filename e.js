const tumblr = require('tumblr.js');
const express = require('express');
const open = require('open');

const app = express();
const port = 3000;

// 替换为你的应用凭证
const CONSUMER_KEY = 'YOUR_CONSUMER_KEY';
const CONSUMER_SECRET = 'YOUR_CONSUMER_SECRET';

const client = tumblr.createClient({
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  returnPromises: true
});

let requestToken, requestTokenSecret;

app.get('/', async (req, res) => {
  try {
    const response = await client.getRequestToken('http://localhost:' + port + '/callback');
    requestToken = response.token;
    requestTokenSecret = response.secret;
    
    const authUrl = `https://www.tumblr.com/oauth/authorize?oauth_token=${requestToken}`;
    open(authUrl);
    res.send('Please check your browser for the Tumblr authorization page.');
  } catch (error) {
    console.error('Error getting request token:', error);
    res.status(500).send('Error occurred');
  }
});

app.get('/callback', async (req, res) => {
  const oauthToken = req.query.oauth_token;
  const oauthVerifier = req.query.oauth_verifier;

  try {
    const response = await client.getAccessToken(requestToken, requestTokenSecret, oauthVerifier);
    const accessToken = response.token;
    const accessTokenSecret = response.secret;

    console.log('Access Token:', accessToken);
    console.log('Access Token Secret:', accessTokenSecret);

    res.send('Authorization successful! Check your console for the tokens.');
    setTimeout(() => process.exit(), 1000);
  } catch (error) {
    console.error('Error getting access token:', error);
    res.status(500).send('Error occurred');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});


// ---------------- 发帖
const tumblr = require('tumblr.js');

// 使用获取到的访问令牌和密钥
const client = tumblr.createClient({
  consumer_key: 'YOUR_CONSUMER_KEY',
  consumer_secret: 'YOUR_CONSUMER_SECRET',
  token: 'YOUR_ACCESS_TOKEN',
  token_secret: 'YOUR_ACCESS_TOKEN_SECRET'
});

const blogName = 'your-blog-name.tumblr.com'; // 你的博客名称

// 发布文本帖子
function postText() {
  client.createTextPost(blogName, {
    title: 'Hello World',
    body: 'This is my first post using the Tumblr API!'
  }, (err, data) => {
    if (err) {
      console.error('Error posting text:', err);
    } else {
      console.log('Text post created:', data);
    }
  });
}

// 发布图片帖子
function postPhoto() {
  client.createPhotoPost(blogName, {
    caption: 'Check out this awesome photo!',
    source: 'https://example.com/path/to/image.jpg' // 替换为你想发布的图片URL
  }, (err, data) => {
    if (err) {
      console.error('Error posting photo:', err);
    } else {
      console.log('Photo post created:', data);
    }
  });
}

// 调用函数发布帖子
postText();
postPhoto();