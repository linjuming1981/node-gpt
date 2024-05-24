(async () => {
  // const AMAZON_SHEET_ID = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  // const productId = 'B0BG94RWYN'
  // const GoogleSheet = require('./classes/GoogleSheet.js')
  // const gSheet = new GoogleSheet()
  
  // let sheetId = AMAZON_SHEET_ID
  // let sheetTabName = '工作表1'
  // let datas = await gSheet.getSheetDatas({sheetId, sheetTabName, filter:{productId}})
  // const ContentRender = require('./classes/ContentRender.js')
  // const render = new ContentRender()
  // let html = render.productToHtml(datas[0])

  let req = {
    body: {
      count: 10,
      filter: '{"aiResult":""}',
      update: '{"aiResult":"creating"}'
    }
  }
  let {filter, update, count} = req.body
  if(typeof filter === 'string'){
    filter = JSON.parse(filter)
  }
  if(typeof update === 'string'){
    update = JSON.parse(filter)
  }



})()
