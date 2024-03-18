const {google} = require('googleapis');

const credentials = require('/path/to/credentials.json');
const spreadsheetId = 'your_spreadsheet_id';
const client = new google.auth.JWT(
  credentials.client_email,
  null,
  credentials.private_key,
  ['https://www.googleapis.com/auth/spreadsheets'],
);

client.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log('Connected!');
    gsrun(client);
  }
});

async function gsrun(cl) {
  const gsapi = google.sheets({version: 'v4', auth: cl});

  // fetch existing rows
  const getRowsOptions = {
    spreadsheetId: spreadsheetId,
    range: 'Sheet1'
  }

  let existingRows = await gsapi.spreadsheets.values.get(getRowsOptions);
  let rowNumber = existingRows.data.values ? existingRows.data.values.length : 0;

  // Append new row
  let newValues = [['Data 1', 'Data 2', 'Data 3']];

  const addRowOptions = {
    spreadsheetId: spreadsheetId,
    range: 'Sheet1!A' + (rowNumber + 1),
    valueInputOption: 'USER_ENTERED',
    resource: {values: newValues},
  };

  let response = await gsapi.spreadsheets.values.append(addRowOptions);
  console.log(response);
}