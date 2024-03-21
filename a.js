const GoogleSheet = require('./google-sheet/GoogleSheet.js')
const gSheet = new GoogleSheet()
let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
let sheetTabName = '工作表1'
// let datas = await gSheet.getSheetDatas(sheetId, sheetTabName)
// console.log(datas)

let datas = [{
  productId: 'kkkk',
  productTitle: 'title',
  productDescription: 'kk desc',
  cost: 11,
  bookDescription: 'bookDescription',
  featurebullets: 'featurebullets',
  editorialReviews: 'editorialReviews',
  detailBullets: 'detailBullets',
  imgs: 'imgs',
}]

console.log(111111, datas)
let ret = gSheet.addSheetDatas(sheetId, sheetTabName, datas)
console.log(2222222, ret)