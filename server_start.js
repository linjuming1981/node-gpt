// Consolas, 'Courier New', monospace


const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const GoogleSheet = require('./google-sheet/GoogleSheet.js')
const Amazon = require('./classes/Amazon.js')

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:false}));

// 自定义跨域中间件
let cors = function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials','true');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};
app.use(cors);

//设置跨域访问
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Content-Type", "application/json;charset=utf-8");
  res.header("X-Powered-By",' 3.2.1')
  next();
});

app.get('/test', async (req, res) => {
  const gSheet = new GoogleSheet()
  let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  let sheetTabName = '工作表1'

  // 查询数据调试
  let datas = await gSheet.getSheetDatas(sheetId, sheetTabName, ['productId', 'postedToBlogger'])
  console.log(datas)
  res.send(datas)

  // 新增数据调试
  // let datas = [{
  //   productId: 'kkkk',
  //   productTitle: 'title',
  //   productDescription: 'kk desc',
  //   cost: 11,
  //   bookDescription: 'bookDescription',
  //   featurebullets: 'featurebullets',
  //   editorialReviews: 'editorialReviews',
  //   detailBullets: 'detailBullets',
  //   imgs: 'imgs',
  // }]
  // let ret = gSheet.addSheetDatas(sheetId, sheetTabName, datas)
  // res.send(ret)
  
})

app.post('/addProductsToSheet', async (req, res) => {
  console.log(222, req.body)
  let products = req.body
  products.forEach(n => {
    for(let i in n){
      if(Array.isArray(n[i])){
        n[i] = JSON.stringify(n[i])
      }
    }
  });
  const gSheet = new GoogleSheet()
  let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  let sheetTabName = '工作表1'
  await gSheet.addSheetDatas(sheetId, sheetTabName, products)
  res.send(req.body)
})

// 服务监听开启
const port = 8080
app.listen(port, function(){
  console.log(`node-gpt: http://localhost:${port}`)
});