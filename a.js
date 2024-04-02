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


// ---------------------

const {google} = require('googleapis');
const sheets = google.sheets('v4');

async function updateProduct(auth, product) {
  // Step 1: Find the row of the product using productId
  let {data: {values}} = await sheets.spreadsheets.values.get({
    spreadsheetId: 'my-spreadsheet-id',
    range: 'Sheet1',
    auth: auth,
  });

  let row = values.findIndex(row => row[0] === product.productId) + 1;  // rowIndex is 0-based
  
  // Step 2: Update the row with the new product information  
  if (row) {
    const request = {
      spreadsheetId: 'my-spreadsheet-id',
      range: `Sheet1!A${row}:O${row}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          product.productId,
          product.productLink,
          product.productTitle,
          product.productDescription,
          product.featurebullets,
          product.detailBullets,
          product.imgs,
          product.cost,
          product.bookDescription,
          product.editorialReviews,
          product.markdownCode,
          product.htmlCode,
          product.postedToBlogger,
        ]],
      },
      auth: auth,
    };

    await sheets.spreadsheets.values.update(request);
    console.log(`Row ${row} updated`);
  } else {
    console.log('Product not found');
  }
}

// Call updateRow with 'auth' and product object
updateProduct(auth, myProduct);