# GmailSend

# Quick Start 🚀

first clone the repo 
### Install server dependencies

install all dependencies

```bash
npm i
```

### Start server

To start the server, run

```bash
npm start
```

# API endpoints 🚀
When you run `npm start` the app will be running on `http://localhost:3000/`.

To create your token you have to go to `http://localhost:3000/start` it will redirect you to Google Oauth signin page
Allow all required access. Then it will redirect to another page
![Screenshot (94)](https://user-images.githubusercontent.com/53190704/118308423-8d9ad600-b509-11eb-8ab9-534ce2d32012.png)

copy that code and paste command-line prompt, and press Enter.
![Screenshot (97)](https://user-images.githubusercontent.com/53190704/118309079-5d076c00-b50a-11eb-935b-461d803aa011.png)

There will be a new file named `token.json` will be created which have access token and refresh token. 

To send mail you have to go to `http://localhost:3000/send` the mail will be sent to the desired email.


