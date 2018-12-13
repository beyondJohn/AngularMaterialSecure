// Get dependencies

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
var formidable = require('formidable');
//const http = require('http');
var http = require('http').Server(app);
const bodyParser = require('body-parser');

//

//const https = require('https');
const fs = require('fs');
const options = {
  hostname: 'switchmagic.com',
key: fs.readFileSync('/etc/letsencrypt/live/switchmagic.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/switchmagic.com/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/switchmagic.com/chain.pem')
};

// Get our API routes
const api = require('./server/routes/api');

// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Point static path to dist
app.use(express.static(path.join(__dirname, 'dist')));

// Set our api routes
app.use('/api', api);

//And GET another
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '4111';
app.set('port', port);

/**
 * Create HTTP server.
 */
//const server = http.createServer(function(options, app){}).listen(4111);
http.listen(4111, function(){
  console.log('listening on *:4111');
});

/**
 * Listen on provided port, on all network interfaces.
 */
//server.listen(port, () => console.log(`API running on localhost:${port}`));
//pm2 start ../serverSony.js -i 0 --name "serverSony"