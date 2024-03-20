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
  // res.send({
  //   name: 'hello world'
  // })

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
  let ret = gSheet.addSheetDatas(sheetId, sheetTabName, datas)
  res.send(ret)

  // let amazon = new Amazon();
  // let url = 'https://www.amazon.com/dp/B006IE2IO8/'
  // let data = amazon.collectPage(url)
  // res.send(data)
})

app.post('/addProductToSheet', async (req, res) => {
  console.log(222, req.body)
  let proInfo = req.body
  for(let i in proInfo){
    if(Array.isArray(proInfo[i])){
      proInfo[i] = JSON.stringify(proInfo[i])
    }
  }
  const gSheet = new GoogleSheet()
  let sheetId = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
  let sheetTabName = '工作表1'
  await gSheet.addSheetDatas(sheetId, sheetTabName, [proInfo])
  res.send(req.body)
})

// 服务监听开启
const port = 8080
app.listen(port, function(){
  console.log(`node-gpt: http://localhost:${port}`)
});