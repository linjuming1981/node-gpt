
// retrieve an access token
function blogCallback(req, res) {
  var oauth2Client = getOAuthClient();
  var code = req.query.code;
  console.log('code', code)
  oauth2Client.getToken(code, function (err, tokens) {
    if (!err) {
      console.log(1111)
      oauth2Client.setCredentials(tokens);
      blogger.posts.insert({
        auth: oauth2Client,
        blogId: config.blogId,
        resource: {
          title: body['title'],
          content: body['content']
        }
      }, function (xx) {
        console.log(222, xx)
        return res.redirect('/');
      });
    } else {
      console.log("error getting blogger API token", err);
    }
  });
}
