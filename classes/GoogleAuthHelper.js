const { google } = require("googleapis");
const config = require('../config.js');

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
}

module.exports = GoogleAuthHelper;