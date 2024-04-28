// 参考文章： https://github.com/andrejnsimoes/pocket-to-blogger/blob/784b0bcab1a95ad62f307ddf7e7f998233484bf6/src/blogger.js#L72


const { google } = require("googleapis");
const fs = require('fs')
const config = require('../config.js');
const path = require('path')

class GoogleAuthHelper {
  constructor(scopes=[]){
    this.scopes = []
    this.setScopes(scopes)
    this.authClient = null;
    this.oauthConf = this.getOAuthConf()
  }

  setScopes(scopes){
    this.scopes = [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/blogger',
      ...scopes
    ]
  }

  // --- 服务账号认证用
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

  // --- oauth2.0认证用
  getOAuthConf(){
    const file = path.resolve(__dirname, '../config/oauth2.json');
    const json = fs.readFileSync(file, 'utf8');
    return JSON.parse(json)
  }
  
  getOAuthClient() {
    const {client_id, client_secret, redirect_uris} = this.oauthConf
    return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  }

  getOAuthUrl() {
    let oauth2Client = this.getOAuthClient();
    let url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: 'https://www.googleapis.com/auth/blogger',
      prompt: 'consent',
    });
    return url;
  }

  getOAuthToken(code){
    return new Promise((resolve, reject) => {
      let oauth2Client = this.getOAuthClient();
      oauth2Client.getToken(code, (err, tokens) => {
        if (!err) {
          oauth2Client.setCredentials(tokens);
          console.log({tokens})
          resolve(tokens)
        } else {
          console.log("error getting token", err);
          resolve({})
        }
      })
    })
  }

}

module.exports = GoogleAuthHelper;