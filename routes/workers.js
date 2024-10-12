const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/worker/yahoo-nba-to-twitter', async(req, res) => {
  let rssUrl = 'https://sports.yahoo.com/nba/rss/';
  const Yahoo = require('../classes/Yahoo.js')
  const yahoo = new Yahoo({ rssUrl, sheetName: 'yahoo_nba' });
  const article = await yahoo.postNewArticleToTwitter()
  console.log('/worker/yahoo-nba-to-twitter', article)
  res.send({code: 200, article})
})

module.exports = router;
