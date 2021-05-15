const express = require('express');
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

const app = express();

let SCOPES = [
  'https://www.googleapis.com/auth/gmail.compose',
  'https://www.googleapis.com/auth/gmail.send',
];

const TOKEN_PATH = 'token.json';

let oAuth2Client;
function authorize(credentials) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );
  return oAuth2Client;
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return authUrl;
}

function makeBody(to, from, subject, message) {
  var str = [
    'Content-Type: text/plain; charset="UTF-8"\n',
    'MIME-Version: 1.0\n',
    'Content-Transfer-Encoding: 7bit\n',
    'to: ',
    to,
    '\n',
    'from: ',
    from,
    '\n',
    'subject: ',
    subject,
    '\n\n',
    message,
  ].join('');

  var encodedMail = Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  return encodedMail;
}

async function sendMessage(auth) {
  var raw = makeBody(
    'awoldahaka@gmail.com',
    'bikashmali12@gmail.com',
    'This is My subject',
    'I got this working finally!!!'
  );
  const gmail = google.gmail({ version: 'v1', auth });
  let email = await gmail.users.messages.send({
    auth: auth,
    userId: 'me',
    resource: {
      raw: raw,
    },
  });
  return email;
}

app.get('/', (req, res) => {
  res.send('Hi');
});

// @desc      Google Oauth signin to create access token and refresh token
// @route     GET /start
// @access    Public

app.get('/start', async (req, res) => {
  fs.readFile('credentials.json', async (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const Usertoken = authorize(JSON.parse(content));
    fs.readFile(TOKEN_PATH, async (err, token) => {
      if (err) {
        let getUrl = await getNewToken(Usertoken);
        res.redirect(getUrl);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });
        rl.question('Enter the code from that page here: ', (code) => {
          rl.close();
          Usertoken.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            Usertoken.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log('Token stored to', TOKEN_PATH);
            });
          });
        });
      } else {
        Usertoken.setCredentials(JSON.parse(token));
      }
    });
  });
});

/* 
@desc      Send a mail
 @route     GET /send
 @access    Login required
 */
app.get('/send', async (req, res, next) => {
  try {
    const email = await sendMessage(oAuth2Client);
    res.json({ email });
  } catch (error) {
    console.log(error.message);
  }
});
const port = 3000;
app.listen(port, () => console.log(`Listening on ${port}`));
