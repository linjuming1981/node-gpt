const GoogleAuthHelper = require('./GoogleAuthHelper.js');
const { google } = require("googleapis");

class GoogleSheet {
  constructor(){
    this.authHelper = new GoogleAuthHelper(["https://www.googleapis.com/auth/spreadsheets"]);
  }

  async getSheetHeaders({ sheetId, sheetTabName = 'Sheet1' }){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.authHelper.getAuthClient()
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
            resolve(header);
          }
        }
      );
    })
  }

  async getSheetDatas({sheetId, sheetTabName = 'Sheet1', columns = [], filter={}, dealJson=false}) {
    return new Promise(async resolve => {
      let datas = []

      if(!columns.length){  // 全量数据
        datas = await this.getAllDatas({sheetId, sheetTabName})
      } else { // 指定列数据
        // 获取表头 B:B,E:E
        let header = await this.getSheetHeaders({sheetId, sheetTabName});
        datas = await Promise.all(columns.map(async column => {
          let index = header.indexOf(column);
          if(index !== -1) {
            let columnLetter = String.fromCharCode('A'.charCodeAt(0) + index);
            let columnRange = columnLetter + ':' + columnLetter;
  
            return this.getDataByColumn(sheetId, sheetTabName, columnRange);
          } else {
            return Promise.resolve([]);
          }
        }));
        datas = this.formatColumnData(datas, columns);
      }

      // 过滤数据
      if(Object.keys(filter).length){
        datas = datas.filter(n => {
          return Object.keys(filter).every(key => n[key] === filter[key].trim())
        })
      }

      // 字段只如果是json，转换成对象或数据
      if(dealJson){
        datas.forEach((n, i) => {
          for(let key in n){
            if(n[key].startsWith('[') || n[key].startsWith('{')){
              try{
                n[key] = JSON.parse(n[key])
              }catch(e){}
            }
          }
        })
      }

      resolve(datas);
    })
  }

  async getHeader({sheetId, sheetTabName = 'Sheet1'}){
    return new Promise(async resolve => {
      if(this.header){
        return resolve(this.header)
      }
      
      let sheets = google.sheets("v4");
      let auth = await this.authHelper.getAuthClient();
      let params = {
        auth,
        spreadsheetId: sheetId,
        range: `${sheetTabName}!A0:Z0`,
      }

      sheets.spreadsheets.values.get(
        params,
        (error, response) => {
          if (error) {
            console.log("Error getting data from sheet:", error);
            resolve([]);
          } else {
            let [headerRow] = response.data.values;
            this.header = headerRow
            resolve(headerRow);
          }
        }
      );
    })
  }

  async getAllDatas({sheetId, sheetTabName}){
    return new Promise(async resolve => {
      let sheets = google.sheets("v4");
      let auth = await this.authHelper.getAuthClient();
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
            this.header = headerRow;
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
      let auth = await this.authHelper.getAuthClient();
  
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


  // 插入新数据 有问题，需要更正 todo
  async addSheetDatas(sheetId, sheetTabName='Sheet1', datas=[]){
    return new Promise(async (resolve, reject) => {
      let sheets = google.sheets("v4");
      let auth = await this.authHelper.getAuthClient();

      let existingRows = await this.getSheetDatas({sheetId, sheetTabName})
      let existingIds = existingRows.map(n => n.productId)
      datas = datas.filter(n => !existingIds.includes(n.productId))
      let dataRows = datas.map(obj => this.header.map(key => obj[key]))

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

  async updateRow(sheetId, sheetTabName='Sheet1', product={}){
    let auth = await this.authHelper.getAuthClient()
    let existingRows = await this.getAllDatas({sheetId, sheetTabName})
    let rowI = existingRows.findIndex(n => n.productId === product.productId)
    let row = existingRows[rowI]
    for(let i in product){
      let n = product[i]
      if(typeof n === 'object'){
        n = JSON.stringify(n, null, 2)
      }
      row[i] = n
    }
    let rowData = this.header.map(n => row[n])

    const request = {
      spreadsheetId: sheetId,
      range: `${sheetTabName}!A${rowI+2}:O${rowI+2}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
      auth: auth,
    };
    
    let sheets = google.sheets("v4");
    await sheets.spreadsheets.values.update(request);
    return true

  }

}

module.exports = GoogleSheet;

// (async () => {
//   const gSheet = new GoogleSheet()
//   let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
//   let sheetTabName = '工作表1'
//   let datas = await gSheet.getSheetDatas({sheetId, sheetTabName})
//   console.log(datas, 222)
// })();
