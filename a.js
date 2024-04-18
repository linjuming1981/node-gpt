const { google } = require("googleapis");
const privateKey = require('./google-token.json');

class GoogleAuthHelper {
  constructor(scopes) {
    this.scopes = scopes;
    this.authClient = null;
  }

  async getAuthClient() {
    return new Promise((resolve, reject) => {
      if (this.authClient) {
        return resolve(this.authClient);
      }

      this.authClient = new google.auth.JWT(
        privateKey.client_email,
        null,
        privateKey.private_key,
        this.scopes,
      );

      this.authClient.authorize((error, tokens) => {
        if (error) {
          console.error("Error connecting to Google API:", error);
          reject(error);
        } else {
          console.log("Connected to Google API successfully!");
          resolve(this.authClient);
        }
      });
    });
  }
}

module.exports = GoogleAuthHelper;

// -------------

const GoogleAuthHelper = require('./GoogleAuthHelper');
const { google } = require("googleapis");

class GoogleBlogger {
    constructor() {
        // 请确保https://www.googleapis.com/auth/blogger权限已经添加到你的Google项目中
        this.authHelper = new GoogleAuthHelper(["https://www.googleapis.com/auth/blogger"]);
    }

    async getBloggerService() {
        const authClient = await this.authHelper.getAuthClient();
        return google.blogger({version: 'v3', auth: authClient});
    }

    async createPost({ blogId, title, content }) {
        try {
            const blogger = await this.getBloggerService();
            const res = await blogger.posts.insert({
                blogId: blogId,
                requestBody: {
                    title: title,
                    content: content,
                }
            });
            console.log("Post created with ID:", res.data.id);
            return res.data;
        } catch (error) {
            console.error("Error creating Blogger post:", error);
            throw error;
        }
    }
}

module.exports = GoogleBlogger;