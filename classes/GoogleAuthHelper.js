const { google } = require("googleapis");
const config = require('../config.js');
const oauth2Conf = require('../config/oauth2.json')

class GoogleAuthHelper {
  constructor(scopes){
    this.scopes = scopes;
    this.authClient = null;
  }

  async getAuthClient() {
    return new Promise((resolve, reject) => {
      if (this.authClient) {
        return resolve(this.authClient);
      }

      this.authClient = new google.auth.JWT(
        config.googleToken2.client_email,
        null,
        config.googleToken2.private_key,
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

  getOAuthClient() {
    const {client_id, client_secret, redirect_uris} = oauth2Conf
    return new OAuth2(client_id, client_secret, redirect_uris[0]);
  }

  getOAuthUrl() {
    var oauth2Client = this.getOAuthClient();
    var url = oauth2Client.generateAuthUrl({
      access_type: 'online',
      scope: 'https://www.googleapis.com/auth/blogger'
    });
    return url;
  }


}

module.exports = GoogleAuthHelper;