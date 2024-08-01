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

app.get('/gptFillQuery', async (req, res) => {
  const {text} = req.body
  const autoTest = new require('./classes/AutoTest.js')
  await autoTest.initialize();
  await autoTest.getPage('chatgpt.com');
  const unswer = await autoTest.gptFillQuery(text)
  res.send({code: 200, data: unswer})
})