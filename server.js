const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const cors = require('cors');
const http = require('http');
const path = require('path');

const app = express();

app.use(cors());
//app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true }));

//const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');
app.use(express.static(path.join(__dirname, 'dist/wizard')));

const userFiles = './user_upload/';
const fs = require('fs');

app.post('/files', bodyParser.json(), (req, res) => {
  console.log(res.json(req.body));
  const file = res.json(req.body);
  console.log(file.content, 'content');
})

// app.post('/files', (req, res) => {
 
//   // console.log(req.body, 'server hit')
//   // const file = req.body;
//   // const base64data = file.content.replace(/^data:.*,/, '');
//   // fs.writeFile(userFiles + file.name, base64data, 'base64', (err) => {
//   //   if (err) {
//   //     console.log(err);
//   //     res.sendStatus(500);
//   //   } else {
//   //     res.set('Location', userFiles + file.name);
//   //     res.status(200);
//   //     res.send(file);
//   //   }
//   // });
// });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/wizard/index.html'))
});

const port = process.env.PORT || '3001';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, () => console.log(`Running on localhost:${port}`));

app.use('/files', express.static(userFiles));