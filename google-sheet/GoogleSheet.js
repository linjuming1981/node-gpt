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

 async getSheetDatas({sheetId, sheetTabName = 'Sheet1', columns = []}) {
    return new Promise(async resolve => {
      // 获取表头 B:B,E:E
      if(!columns.length){
        let allDatas = await this.getAllDatas({sheetId, sheetTabName})
        return resolve(allDatas)
      }
      
      let header = await this.getSheetHeaders({sheetId, sheetTabName});
      let datas = await Promise.all(columns.map(async column => {
        let index = header.indexOf(column);
        if(index !== -1) {
          let columnLetter = String.fromCharCode('A'.charCodeAt(0) + index);
          let columnRange = columnLetter + ':' + columnLetter;

          return this.getDataByColumn(sheetId, sheetTabName, columnRange);
        } else {
          return Promise.resolve([]);
        }
      }));

      let formattedDatas = this.formatColumnData(datas, columns);

      resolve(formattedDatas);
    })
  }

  async getAllDatas({sheetId, sheetTabName}){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth()
      let params = {
        auth,
        spreadsheetId: sheetId,
        range: sheetTabName,
      }

      sheets.spreadsheets.values.get(
        params,
        (error, response) => {
          if (error) {
            console.log("Error getting data from sheet:", error);
            resolve([]);
          } else {
            let [headerRow, ...dataRows] = response.data.values;
            let datas = dataRows.map(row => {
              return row.reduce((obj, value, index) => {
                obj[headerRow[index]] = value;
                return obj;
              }, {});
            });

            resolve(datas);
          }
        }
      );
    })
  }

  async getDataByColumn(sheetId, sheetTabName, columnRange) {
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.getAuth()
  
      let params = {
        auth,
        spreadsheetId: sheetId,
        range: sheetTabName + '!' + columnRange,
      }
  
      sheets.spreadsheets.values.get(
        params,
        (error, response) => {
          if (error) {
            console.log("Error getting data from sheet:", error);
            resolve([]);
          } else {
            console.log("Data from sheet:", response.data.values);
            resolve(response.data.values.slice(1)); // Here we remove the header row
          }
        }
      );
    });
  }

  formatColumnData(datas, columns) {
    let maxLength = Math.max(...datas.map(data => data.length));

    return Array.from({length: maxLength}).map((_, index) => {
      return columns.reduce((obj, column, i) => {
        obj[column] = datas[i][index] ? datas[i][index][0] : '';  // Get the value, if exist
        return obj;
      }, {});
    });
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

(async () => {
  const gSheet = new GoogleSheet()
  let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  let sheetTabName = '工作表1'
  let datas = await gSheet.getSheetDatas({sheetId, sheetTabName})
  console.log(datas, 222)
})();
