const path = require('path');
const {google} = require('googleapis');
const blogger = google.blogger('v3');

async function runSample() {
  const auth = new google.auth.GoogleAuth({
    keyFilename: path.join(__dirname, './config/service.json'),
    scopes: 'https://www.googleapis.com/auth/blogger',
  });

  const authClient = await auth.getClient();

  google.options({auth: authClient});

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