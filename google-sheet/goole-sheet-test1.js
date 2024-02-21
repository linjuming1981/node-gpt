const { google } = require("googleapis");

let sheets = google.sheets("v4");
let privateKey = require("./google-token.json");

let authClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ["https://www.googleapis.com/auth/spreadsheets"],
);

authClient.authorize((error, tokens) => {
  if (error) {
    console.log("Error connecting to Google Sheets API:", error);
    return;
  } else {
    console.log("Connected to Google Sheets API successfully!");
    getDataFromSheet(authClient);
  }
});

// console.log(11111)
// process.exit()

function getDataFromSheet(authClient) {
  sheets.spreadsheets.values.get(
    {
      auth: authClient,

      // 对应google sheet地址：https://docs.google.com/spreadsheets/d/1SDq6dHqGbQ7YqgqW_FC5sgKQDdKlyQ3iql_uxSx6D-Y/edit#gid=0
      spreadsheetId: "1SDq6dHqGbQ7YqgqW_FC5sgKQDdKlyQ3iql_uxSx6D-Y",
      range: "Sheet1",
    },
    (error, response) => {
      if (error) {
        console.log("Error getting data from sheet:", error);
      } else {
        console.log("Data from sheet:", response.data.values);
      }
    },
  );
}
