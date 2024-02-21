const privateKey = require('./google-token.json')
const { google } = require("googleapis");

class GoogleSheet {

  getAuth(){
    return new Promise(resolve => {
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
          resolve(authClient)
        }
      });
    })
  }

  async getSheetData(){
    let sheets = google.sheets("v4");
    let auth = await this.getAuth()
    let data = {aaa: '111111'}
    sheets.spreadsheets.values.get(
      {
        auth,
  
        // 对应google sheet地址：https://docs.google.com/spreadsheets/d/1SDq6dHqGbQ7YqgqW_FC5sgKQDdKlyQ3iql_uxSx6D-Y/edit#gid=0
        spreadsheetId: "1SDq6dHqGbQ7YqgqW_FC5sgKQDdKlyQ3iql_uxSx6D-Y",
        range: "Sheet1",
      },
      (error, response) => {
        if (error) {
          console.log("Error getting data from sheet:", error);
        } else {
          console.log("Data from sheet:", response.data.values);
        }
      },
    );
    return data
  
  }

}

module.exports = GoogleSheet;