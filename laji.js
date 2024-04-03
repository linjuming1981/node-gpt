
(async () => {
  const AMAZON_SHEET_ID = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  const GoogleSheet = require('./google-sheet/GoogleSheet.js')
  const gSheet = new GoogleSheet()
  
  let sheetId = AMAZON_SHEET_ID
  let sheetTabName = '工作表1'
  
  // let filter = {markdownCode: '', htmlCode: ''}
  // let datas = await gSheet.getSheetDatas({sheetId, sheetTabName, filter})
  // console.log(datas)  

  gSheet.updateRow(sheetId, sheetTabName, {"productId": "111", "productLink": "aaa"})


})()