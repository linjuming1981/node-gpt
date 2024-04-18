const GoogleAuthHelper = require('./GoogleAuthHelper');
const { google } = require("googleapis");
const config = require('../config.js');

class GoogleBlogger {
  constructor() {
    this.authHelper = new GoogleAuthHelper(["https://www.googleapis.com/auth/blogger"]);
  }

  async getBloggerService() {
    const authClient = await this.authHelper.getAuthClient();
    return google.blogger({ version: 'v3', auth: authClient });
  }

  async createPost({title, content }) {
    let blogId = config.blogger.blogId
    console.log('blogId', blogId)
    // try {
    //   const blogger = await this.getBloggerService();
    //   const res = await blogger.posts.insert({
    //     blogId,
    //     requestBody: {
    //       title: title,
    //       content: content,
    //     }
    //   });
    //   console.log("Post created with ID:", res.data.id);
    //   return res.data;
    // } catch (error) {
    //   console.error("Error creating Blogger post:", error);
    //   throw error;
    // }
  }
}

module.exports = GoogleBlogger;

// ---------- 调试
(async () => {
  const blogger = new GoogleBlogger()
  let post = {
    title: 'aaaa',
    content: 'bbbbb'
  }
  await blogger.createPost(post)
  console.log(22222)
})();