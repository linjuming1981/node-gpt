const privateKey = require('./google-token.json')
const { google } = require("googleapis");

class GoogleSheet {
  constructor(){
    this.auth = null
  }

  getAuth(){
    return new Promise(resolve => {
      if(this.auth){
        return resolve(this.auth)
      }

      let authClient = new google.auth.JWT(
        privateKey.client_email,
        null,
        privateKey.private_key,
        ["https://www.googleapis.com/auth/spreadsheets"],
      );
      
      authClient.authorize((error, tokens) => {
        if (error) {
          console.log("Error connecting to Google Sheets API:", error);
          resolve(false)
        } else {
          console.log("Connected to Google Sheets API successfully!");
          this.auth = authClient
          resolve(authClient)
        }
      });
    })
  }

  // 获取excel表中所有数据
  async getSheetDatas(sheetId, sheetTabName='Sheet1'){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth()
      sheets.spreadsheets.values.get(
        {
          auth,
    
          // 对应google sheet地址：https://docs.google.com/spreadsheets/d/1SDq6dHqGbQ7YqgqW_FC5sgKQDdKlyQ3iql_uxSx6D-Y/edit#gid=0
          spreadsheetId: sheetId,
          range: sheetTabName,
        },
        (error, response) => {
          if (error) {
            console.log("Error getting data from sheet:", error);
            resolve(false)
          } else {
            console.log("Data from sheet:", response.data.values);
            resolve(response.data.values)
          }
        },
      );
    })
  }

  // 插入新数据
  async addSheetDatas(sheetId, sheetTabName='Sheet1', datas){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth()
      // 做到这里，实在太困了

      let existingRows = await this.getSheetDatas(sheetId, 'Sheet1')

    })
  }

}

module.exports = GoogleSheet;