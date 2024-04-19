const path = require('path');
const {google} = require('googleapis');
const {authenticate} = require('@google-cloud/local-auth');

const blogger = google.blogger('v3');

async function runSample() {
  // Obtain user credentials to use for the request
  const auth = await authenticate({
    // keyfilePath: path.join(__dirname, '../oauth2.keys.json'),
    keyfilePath: path.join(__dirname, './config/google-oauth2.json'),
    scopes: 'https://www.googleapis.com/auth/blogger',
  });
  google.options({auth});

  const res = await blogger.posts.insert({
    blogId: '8563811807642467410',
    requestBody: {
      title: 'Hello from the googleapis npm module!',
      content:
        'Visit https://github.com/google/google-api-nodejs-client to learn more!',
    },
  });
  console.log(res.data);
  return res.data;
}

if (module === require.main) {
  runSample().catch(console.error);
}
module.exports = runSample;