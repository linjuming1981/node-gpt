const axios = require('axios');
let url = 'https://www.youtube.com/watch?v=rBw20q3wkf8';
// url = 'https://www.google.com';
// url = 'https://stackblitz.com';
url = 'https://api.openai.com/v1/chat/completions';
url = 'https://m.84sk.com/c/9320.html';

axios({
  url,
  method: 'get',
  // timeout: 5000,
  // headers: {
  //   'Content-type': 'application/json',
  // },
}).then((res) => {
  console.log(res);
});

// const Http = require('https');
// Http.request(url, function (response) {
//   if (response.statusCode !== 200) {
//     return callback(
//       new Error(`Request to ${url} failed, status code: ${response.statusCode}`)
//     );
//   }

//   const chunks = [];
//   response.on('data', function (chunk) {
//     chunks.push(chunk);
//   });
//   response.on('end', function () {
//     const buffer = Buffer.concat(chunks);
//     console.log(11111, chunks);
//   });
//   response.on('error', function (e) {
//     console.log(2222, chunks);
//   });
// }).end();
