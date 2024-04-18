
(async () => {
  const AMAZON_SHEET_ID = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  const GoogleSheet = require('./classes/GoogleSheet.js')
  const gSheet = new GoogleSheet()
  
  let sheetId = AMAZON_SHEET_ID
  let sheetTabName = '工作表1'
  
  // // let filter = {markdownCode: '', htmlCode: ''}
  // // let datas = await gSheet.getSheetDatas({sheetId, sheetTabName, filter})
  // // console.log(datas)  

  // gSheet.updateRow(sheetId, sheetTabName, {"productId": "111", "productLink": "aaa"})


  // ------ 用fetch调试接口
  // let url = 'https://8080-cs-239467590834-default.cs-us-west1-wolo.cloudshell.dev/addProductsToSheet';
  
  // let data = {products: []}

  // fetch(url, {
  //   method: 'POST', 
  //   headers: {
  //     'Content-Type': 'application/json', 
  //   },
  //   body: JSON.stringify(data), 
  // })
  // .then(response => response.json())  
  // .then(data => console.log(data))  
  // .catch((error) => console.error('Error:', error));
  
  // -----  
  let datas = await gSheet.getSheetDatas({sheetId, sheetTabName, dealJson:true})
  console.log(datas[0])

 })()