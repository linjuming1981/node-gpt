const tumblr = require('tumblr.js');

class Tumblr {
  constructor(){
    this.client = this.getClient()
  }

  getClient(){
    // 通过 https://www.tumblr.com/oauth/apps -> Explore API工具生成
    const client = tumblr.createClient({
      consumer_key: 'gzBMbQWEVfOcY2zClcVzpzCP8QP2XcrDpmGAYQWLNuDCFBfVik',
      consumer_secret: 'ZI9p4Yxpaee3EqE0bbQtx7YSIR5RBEpw3RR8I4m4XZiuMjv5cI',
      token: 'Gpr1j56qVORXdp7HZvWYICTqEVf1WsarXbJaLLRvfG85EaRkRM',
      token_secret: 'YoiZ4cFMdGxCXFlGj5b5vUdI6pLMR8fSjOEn0WdG0e6e2O7aSB'
    });
    return client  
  }  

  async createPost(product){
    const {subCont, imgUrl, bloggerPostUrl} = product
    const blogName = 'linjuming'
    try {
      const res = await this.client.createPost(blogName, {
        content: [
          {
            type: "image",
            media: [
                {
                    "type": "image/jpeg",
                    "url": imgUrl,
                    "width": 1024,
                    "height": 1024
                }
            ]
          },
          {
            type: 'text',
            text: subCont,
          },
          {
            type: "link",
            url: bloggerPostUrl,
            description: "",
         }
        ],
      });
      console.log('Post created successfully');
      return res.id
    } catch (error) {
      console.error('Error creating post:', error);
    }
  }

}

module.exports = Tumblr

if(module === require.main){
  (async () => {
    const tumblr = new Tumblr()
  })()  
}
