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

  async getSheetHeaders({ sheetId, sheetTabName = 'Sheet1' }){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth();
      sheets.spreadsheets.values.get(
        {
          auth,
          spreadsheetId: sheetId,
          range: sheetTabName + '!1:1',
        },
        (error, response) => {
          if (error) {
            console.log("Error getting header from sheet:", error);
            resolve([]);
          } else {
            let header = response.data.values[0];
            console.log("Header from sheet: ", header);
            resolve(header);
          }
        }
      );
    })
  }

  // 获取excel表中所有数据
  async getSheetDatas(sheetId, sheetTabName='Sheet1', columns = []){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth()
 

      // 获取表头 B:B,E:E
      let header = await this.getSheetHeaders({ sheetId, sheetTabName });
      let columnsRange = columns.map(column => {
        let index = header.indexOf(column);
        if(index !== -1) {
          let columnLetter = String.fromCharCode('A'.charCodeAt(0) + index);
          return columnLetter + ':' + columnLetter;
        }
        return '';
      }).join(',');

      // 传参
      let params = {
        auth,
        spreadsheetId: sheetId,
      }
      if(columns.length){
        params.range = sheetTabName + '!' + columnsRange;
      } else {
        params.range = sheetTabName;
      }

      sheets.spreadsheets.values.get(
        params,
        (error, response) => {
          if (error) {
            console.log("Error getting data from sheet:", error);
            resolve([])
          } else {
            console.log("Data from sheet:", response.data.values);
            resolve(response.data.values)
          }
        },
      );
    })
  }

  // 插入新数据
  async addSheetDatas(sheetId, sheetTabName='Sheet1', datas=[]){
    return new Promise(async (resolve, reject) => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth()

      let existingRows = await this.getSheetDatas(sheetId, sheetTabName)
      let header = existingRows[0] // ['name', 'value', 'age']  

      let dataRows = datas.map(obj => header.map(key => obj[key]))

      const addRowOptions = {
        spreadsheetId: sheetId,
        range: `${sheetTabName}!A${existingRows.length + 1}`,
        valueInputOption: 'USER_ENTERED',
        resource: {
          values: dataRows
        }
      }

      sheets.spreadsheets.values.append(
        {
          auth, 
          ...addRowOptions, 
        },function(err, response) {
        if(err) {
          console.log('The API returned an error: ' + err);
          return reject(err);
        }
        resolve(response);
      });

    })
  }

}

module.exports = GoogleSheet;

// (async () => {
//   const gSheet = new GoogleSheet()
//   let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
//   let sheetTabName = '工作表1'
//   let datas = await gSheet.getSheetDatas(sheetId, sheetTabName)
//   console.log(datas, 222)
// })();
