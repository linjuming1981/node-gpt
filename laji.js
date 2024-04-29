function refreshAccessToken(refreshToken) {
  return new Promise((resolve, reject) => {
    let oauth2Client = new google.auth.OAuth2(
      your_client_id,     // Replace with your own client ID
      your_client_secret, // Replace with your own client secret
      your_redirect_uri   // Replace with your own redirect URI
    );

    // 设置现有的 refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken
    });

    // 获取新的 access token
    oauth2Client.refreshAccessToken((err, tokens) => {
      if (err) {
        console.error('Error refreshing access token: ', err);
        reject(err);
      } else {
        oauth2Client.setCredentials(tokens);
        console.log('Access token refreshed: ', tokens);
        resolve(tokens);
      }
    });
  });
}

// 使用 refresh token 来刷新 access token
refreshAccessToken('your_refresh_token_here')
  .then(tokens => {
    // 使用新的 access token 执行一些操作...
  })
  .catch(err => {
    // 处理错误...
  });