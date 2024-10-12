const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/worker/yahoo-nba-to-twitter', async(req, res) => {
  const article = {title: 'text'}
  res.send({code: 200, article})
})

module.exports = router;
