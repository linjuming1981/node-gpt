
(async () => {
  const GoogleSheet = require('./google-sheet/GoogleSheet.js')
  const gSheet = new GoogleSheet()
  
  let filter = {markdownCode: '', htmlCode: ''}
  let sheetId = AMAZON_SHEET_ID
  let sheetTabName = '工作表1'
  
  let datas = await gSheet.getSheetDatas({sheetId, sheetTabName, filter})
  console.log(datas)
})()