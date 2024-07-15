// Consolas, 'Courier New', monospace
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()
const AMAZON_SHEET_ID = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
const GoogleSheet = require('./classes/GoogleSheet.js')
const sheetId = AMAZON_SHEET_ID
const sheetTabName = '工作表1'
const gSheet = new GoogleSheet({sheetId, sheetTabName})

// 完美世界小说sheet
const bookSheet = new GoogleSheet({
  sheetId: '1QWY7q2HxQMq2D2DhDSxXjErWbRgZIEtpQqELnMVd0QY',
  sheetName: '工作表1'
})

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:false}));
app.use(express.static('public'));

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
  res.header("X-Powered-By",' 3.2.1')
  
  // 针对API和需要返回JSON格式的请求设置Content-Type
  if (!req.url.startsWith('/public/')) {
    res.header("Content-Type", "application/json;charset=utf-8");
  }

  next();
});


// app.get("/", function (req, res) {
//   res.sendFile(path.join(__dirname, "/public/index.html"));
// });

app.get('/test', async (req, res) => {
  // const GoogleSheet = require('./classes/GoogleSheet.js')
  // const gSheet = new GoogleSheet()
  // let sheetId = AMAZON_SHEET_ID
  // let sheetTabName = '工作表1'

  // 调通测试
  // res.send({data: [{name:'a', value: 111}]})

  // 查询数据调试
  // let datas = await gSheet.getSheetDatas({sheetId, sheetTabName, columns:['productId', 'postedToBlogger']})
  let datas = await gSheet.getSheetDatas({dealJson:true})
  res.send(datas)

  // 新增数据调试 1111
  // let datas = [{
  //   productId: 'kkkk',
  //   productTitle: 'title',
  //   productDescription: 'kk desc', 
  //   cost: 11,
  //   bookDescription: 'bookDescription',
  //   featurebullets: 'featurebullets',
  //   editorialReviews: 'editorialReviews',`
  //   detailBullets: 'detailBullets',
  //   imgs: 'imgs',
  // }]
  // let ret = gSheet.addSheetDatas(sheetId, sheetTabName, datas)
  // res.send(ret)  
  
})

app.post('/addProductsToSheet', async (req, res) => {
  let products = req.body
  products.forEach(n => {
    for(let i in n){
      if(Array.isArray(n[i])){
        n[i] = JSON.stringify(n[i])
      }
    }
  });
  await gSheet.addSheetDatas({datas: products})
  res.send(req.body)
})

app.get('/getAllSheetRows', async (req, res) => {
  let datas = await gSheet.getSheetDatas()
  res.send({code: 200, data: datas})
})

app.post('/getSheetRows', async (req, res) => {
  console.log('/getSheetRows', req.body)
  let {filter, update, count} = req.body
  if(typeof filter === 'string'){
    filter = JSON.parse(filter)
  }
  if(typeof update === 'string'){
    update = JSON.parse(update)
  }

  let datas = await gSheet.getSheetDatas({filter, count})

  if(update){ // 获取到的记录做更新操作111
    datas.forEach(product => {
      gSheet.updateRow({product: {...product, ...update}});  // update是个对象，如 {status: 0}
    })
  }

  let idsObj = {}
  for(let i=1; i<=10; i++){
    idsObj[`productId${i}`] = datas[i-1]?.productId
  }

  res.send({code: 200, data: datas, ...idsObj})
})

app.post('/getOneRow', async (req, res) => {
  console.log('/getOneRow', req.body)
  let filter = req.body.filter
  if(typeof filter === 'string'){
    filter = JSON.parse(filter)
  }
  let datas = await gSheet.getSheetDatas({filter})
  let item = datas[0]
  res.send({code: 200, data: item})
})

app.post('/updateRow', async (req, res) => {
  console.log('/updateRow', req.body)
  let product = req.body.product
  if(typeof product === 'string'){
    product = JSON.parse(product)
  }
  gSheet.updateRow({product})
  res.send({code: 200, data: product})
})

app.get('/preview/:id', async (req, res) => {
  const productId = req.params.id
  let datas = await gSheet.getSheetDatas({filter:{productId}})
  const ContentRender = require('./classes/ContentRender.js')
  const render = new ContentRender()
  let html = render.productToHtml(datas[0])
  res.set('Content-Type', 'text/html');  
  res.send(html);
})

app.get('/json/:id', async (req, res) => {
  const productId = req.params.id
  let datas = await gSheet.getSheetDatas({filter:{productId}})
  let product = datas[0]
  if(!req.full){
    delete product.markdownCode
    delete product.htmlCode
    delete product.aiResult
  }
  res.send(product)
})

app.post('/googleOauth', (req, res) => {
  const baseUrl = req.body.baseUrl
  const GoogleAuthHelper = require('./classes/GoogleAuthHelper.js');
  const authHelper = new GoogleAuthHelper()
  let url = authHelper.getOAuthUrl()
  res.send({code: 200, url})  
})

app.get('/getOauthConf', (req, res) => { 
  const file = './config/oauth2.json'
  const config = fs.readFileSync(file).toString()
  res.send({code: 200, config})
})

app.post('/saveOauthConf', (req, res) => {
  const config = req.body.config
  const file = './config/oauth2.json'
  fs.writeFileSync(file, config)
  res.send({code: 200})
})

app.get('/saveOauthToken', async (req, res) => {
  code = req.query.code
  const GoogleAuthHelper = require('./classes/GoogleAuthHelper.js');
  const authHelper = new GoogleAuthHelper()
  let tokens = await authHelper.getOAuthToken(code)

  console.log({code, tokens})
  res.send({code: 200, oauth2Code:code, tokens})
})

app.post('/createBlogPost', async (req, res) => {
  const {product} = req.body
  const ContentRender = require('./classes/ContentRender.js')
  const render = new ContentRender()  
  const html = render.productToHtml(product)
  let {aiResult} = product
  if(typeof aiResult === 'string'){
    aiResult = JSON.parse(aiResult)
  }
  const title = aiResult.title

  const GoogleBlogger = require('./classes/GoogleBlogger.js') 
  const blogger = new GoogleBlogger()
  const ret = await blogger.createPost({title, content: html})
  product.postedToBlogger = '1'
  gSheet.updateRow({product})
  res.send({code: 200, ret})
})


// 服务监听开启  
const port = 8080
app.listen(port, function(){
  console.log(`node-gpt: http://localhost:${port}`)
});