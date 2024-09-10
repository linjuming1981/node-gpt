const tumblr = require('tumblr.js');
const client = tumblr.createClient({
  consumer_key: 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik',
  consumer_secret: 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI',
  token: '8gts2OcL09Sb3T64rWxRklJxWiJiCe0rs4yNq6LlunY9ZOlVqf',
  token_secret: '22iUpuki9XEkfYFCtgS2BIz4BwhaZq5WiSWURQFRhxAeixCmi6'
});

const blogName = 'linjuming.tumblr.com';
const postOptions = {
  type: 'photo',
  caption: 'This is a photo post',
  tags: ['nodejs', 'tumblr'],
  data: [
    './temp/output.png',
  ]
};

client.createPost(blogName, postOptions)
  .then(response => {
    console.log('Post created:', response.id);
  })
  .catch(error => {
    console.error('Error creating post:', error);
  });