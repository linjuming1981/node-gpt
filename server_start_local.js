// Consolas, 'Courier New', monospace
const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
const app = express()

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

app.post('/gptFillQuery', async (req, res) => {
  console.log(1111111);
  const {text} = req.body
  const AutoTest = require('./classes/AutoTest.js')
  const autoTest = new AutoTest()
  await autoTest.initialize();
  const unswer = await autoTest.gptFillQuery(text)
  res.send({code: 200, data: unswer})
})

// 服务监听开启  
const port = 9000
app.listen(port, function(){
  console.log(`node-gpt: http://localhost:${port}`)
});
