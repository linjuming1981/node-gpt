// Consolas, 'Courier New', monospace
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

const AMAZON_SHEET_ID = '1vJ8n1n6nrAv8YO4wSpI3AhFddAaWuq06UzHDxVE9pKQ'
const GoogleSheet = require('./classes/GoogleSheet.js')
const Util = require('./classes/Util.js')
const sheetId = AMAZON_SHEET_ID
const sheetTabName = '工作表1'
const gSheet = new GoogleSheet({sheetId, sheetTabName})

// 完美世界小说sheet
const novelSheet = new GoogleSheet({
  sheetId: '1QWY7q2HxQMq2D2DhDSxXjErWbRgZIEtpQqELnMVd0QY',
  sheetTabName: '工作表1'
})

app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.urlencoded({limit:'50mb',extended:false}));
app.use(express.static('public'));
app.use('/temp', express.static(path.join(__dirname, './temp'))) 

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

app.post('/createNovelBlogPost', async (req, res) => {
  let {product, worker} = req.body
  if(worker){ // cloudflare worker定时任务触发
    let filter = {enTitle:'NOT_EMPTY', enCont: 'NOT_EMPTY', imgUrl: 'NOT_EMPTY', bloggerPostUrl:''}
    let products = await novelSheet.getSheetDatas({filter})
    product = products[0]
  } else if(typeof product === 'string'){
    product = JSON.parse(product)
  }

  if(!product){
    console.log('/createNovelBlogPost -- 无product')
    return
  }

  const Novel = require('./classes/Novel.js')
  const novel = new Novel()
  const ret = await novel.postToBlogger(product)
  console.log('/createNovelBlogPost success -- ', product.enTitle)
  res.send({code: 200, ret})
})

app.post('/getNovelRows', async (req, res) => {
  console.log('/getNovelRows');
  let {filter, update, count} = req.body
  if(typeof filter === 'string'){
    filter = JSON.parse(filter)
  }
  if(typeof update === 'string'){
    update = JSON.parse(update)
  }

  let datas = await novelSheet.getSheetDatas({filter, count})
  if(update){ // 获取到的记录做更新操作
    datas.forEach(product => {
      novelSheet.updateRow({product: {...product, ...update}});  // update是个对象，如 {status: 0}
      // 做到这里，todo 2024-7-15
    })
  }

  const Novel = require('./classes/Novel.js')
  const novel = new Novel()
  datas.forEach(n => {
    let arr = novel.splitChapterContent(n.cnCont, 2500)
    n.cnParts = arr
  })
  console.log(12345);

  let idsObj = {}
  for(let i=0; i<10; i++){
    idsObj[`productId${i}`] = datas[i]?.productId
  }

  res.send({code: 200, data: datas, ...idsObj})
})

app.post('/getOneNovel', async (req, res) => {
  console.log('/getOneNovel', req.body)
  let filter = req.body.filter
  if(typeof filter === 'string'){
    filter = JSON.parse(filter)
  }
  let datas = await novelSheet.getSheetDatas({filter})

  const Novel = require('./classes/Novel.js')
  const novel = new Novel()
  datas.forEach(n => {
    let arr = novel.splitChapterContent(n.cnCont)
    let cnParts = {}
    arr.forEach((n1, i1) => {
      n1 = n1.replace(/猿/g, '大猴'); // coze翻译报错处理
      cnParts[`part${i1}`] = n1
    })
    n.cnParts = cnParts
  })

  let item = datas[0]
  res.send({code: 200, data: item})
})

app.post('/updateNovel', async (req, res) => {
  let novel = req.body.novel
  if(typeof novel === 'string'){
    novel = JSON.parse(novel)
  }
  novelSheet.updateRow({product: novel})
  res.send({code: 200, data: novel})
})

// 通过cloudFlare定时任务发博文到blooger
app.get('/cronPostNovelToBlogger', async (req, res) => {
  const Novel = require('./classes/Novel.js')
  const novel = new Novel()

  let filter = {
    postedToBlogger: '0', 
    enTitle: 'NOT_EMPTY'
  }  
  let datas = await novelSheet.getSheetDatas({filter})
  const rets = []
  datas = datas.slice(0, 2)

  for (let i = 0; i < datas.length; i++) {
    const n = datas[i];
    const ret = await novel.postToBlogger(n);
    rets.push(ret);
  }

  res.send({code: 200, data: rets})
})


app.get('/novelPreview/:id', async (req, res) => {
  console.log('/novelPreview')   
  const productId = req.params.id
  let datas = await novelSheet.getSheetDatas({filter:{productId}})
  const Novel = require('./classes/Novel.js')
  const novel = new Novel()
  let cnHtml = novel.renderHtml(datas[0], 'cn')
  let enHtml = novel.renderHtml(datas[0], 'en')
  const html =`
    <div class="novel_box">
      ${cnHtml}
      ${enHtml}
    </div>
    <style>
      *{margin: 0; padding:0;}
      .novel_box{display: flex;}
      main {
        width: 50%;
        flex: 1;
        padding: 20px;
        height: 100vh;
        overflow-y: overlay;
      }
    </style>
  `
  res.set('Content-Type', 'text/html');  
  res.send(html);
})

app.get('/saveImgurOauth2Token', async (req, res) => {
  const code = req.query.code
  const Imgur = require('./classes/Imgur.js')
  const imgur = new Imgur()
  const accessToken = await imgur.getOauth2Token(code)
  res.send(accessToken)
})

// 创建章节图片
app.post('/createNovelChapterImg', async (req, res) => {
  let {product, worker} = req.body
  if(worker){ // cloudflare worker定时任务触发
    let filter = {imgPrompt: 'NOT_EMPTY', imgUrl: ''}
    let products = await novelSheet.getSheetDatas({filter})
    product = products[0]
  } else if(typeof product === 'string'){
    product = JSON.parse(product)
  }

  if(!product){
    console.log('/createNovelChapterImg -- 无product')
    return
  }

  const {productId, imgPrompt} = product

  const Novel = require('./classes/Novel.js')
  const novel = new Novel()

  const imgUrl = await novel.createNovelChaterImg(imgPrompt)
  console.log('imgUrl', imgUrl)

  const _product = {
    productId,
    imgUrl
  }
  novelSheet.updateRow({product: _product})
  console.log('/createNovelChapterImg sucess --- ', product.enTitle, imgUrl)
  res.send({code: 200, imgUrl})
})

// 发贴到twitter
app.post('/postNovelToTwitter', async (req, res) => {
  let {product, worker} = req.body
  if(worker){ // cloudflare worker定时任务触发
    let filter = {subCont: 'NOT_EMPTY', bloggerPostUrl: 'NOT_EMPTY', imgUrl: 'NOT_EMPTY', twitterId: ''}
    let products = await novelSheet.getSheetDatas({filter})
    product = products[0]
  } else if(typeof product === 'string'){
    product = JSON.parse(product)
  }

  if(!product){
    console.log('/postNovelToTwitter -- 无product')
    return
  }

  const Novel = require('./classes/Novel.js')
  const novel = new Novel()

  const ret = await novel.postToTwitter(product)

  const _product = {
    productId: product.productId,
    twitterId: ret?.data?.id || 'xxx1'
  }
  novelSheet.updateRow({product: _product})

  console.log('/postNovelToTwitter sucess --- ', product.enTitle)
  res.send({code: 200, data: ret})
})

// 发贴到twitter
app.post('/postNovelToTumblr', async (req, res) => {
  let {product} = req.body
  if(typeof product === 'string'){
    product = JSON.parse(product)
  }
  const Novel = require('./classes/Novel.js')
  const novel = new Novel()

  const ret = await novel.postToTumblr(product)
  res.send({code: 200, data: ret})
})

// twitter评论
app.post('/twitterAiReply', async (req, res) => {
  const {postId, postCont, replyCont, imgPrompt} = req.body
  const Twitter = require('./classes/Twitter.js')
  const twitter = new Twitter
  const ret = await twitter.aiReplyPost({postId, replyCont, imgPrompt})
  res.send({code: 200, data: ret})
})

app.get('/keepAlive', async (req, res) => {
  const nowDateTime = Util.getDateTime()
  console.log('防止render服务休眠', nowDateTime);
  res.send(nowDateTime);
})

// cloudflare 没法看woker日志，使用这个接口打印 --- 无用，废弃
app.post('/workerLog', async (req, res) => {
  const now = Util.getDateTime()
  const {logs} = res.body
  console.log(now, ...logs)
  res.send({code:200, logs})
})

app.post('/createImgByPrompt', async (req, res) => {
  const {imgPrompt} = req.body
  const ImgAi = require('./classes/ImgAi.js')
  const imgAi = new ImgAi()
  const imgPath = './temp/img_by_prompt.jpeg'
  const imgPathAbs = path.resolve(__dirname, imgPath)
  imgAi.createImg({prompt: imgPrompt, savePath: imgPathAbs})
  res.send({code:200, imgUrl: imgPath})
})


// 服务监听开启  
const port = 8080
app.listen(port, function(){
  console.log(`node-gpt: http://localhost:${port}`)
});


// 冲突时，丢弃本地代码，使用远程代码命令： git reset --hard origin/master