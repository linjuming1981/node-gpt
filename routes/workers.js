const express = require('express');
const router = express.Router();
const path = require('path');

// 篮球运动
router.get('/worker/yahoo-nba-to-twitter', async(req, res) => {
  let rssUrl = 'https://sports.yahoo.com/nba/rss/';
  const Yahoo = require('../classes/Yahoo.js')
  const yahoo = new Yahoo({ rssUrl, sheetName: 'yahoo_nba', twitterAccount:'hello_abc1@gongjua.com' });
  const article = await yahoo.postNewArticleToTwitter()
  console.log('/worker/yahoo-nba-to-twitter', article)
  res.send({code: 200, article})
})

// 冰球运动
router.get('/worker/yahoo-nhl-to-twitter', async(req, res) => {
  let rssUrl = 'https://sports.yahoo.com/nhl/rss/';
  const Yahoo = require('../classes/Yahoo.js')
  const yahoo = new Yahoo({ rssUrl, sheetName: 'yahoo_nhl', twitterAccount:'nhl_2024@gongjua.com' });
  const article = await yahoo.postNewArticleToTwitter()
  console.log('/worker/yahoo-nhl-to-twitter', article)
  res.send({code: 200, article})
})

module.exports = router;
