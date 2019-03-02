'use strict';

// build app using express
var express = require('express');
var app = express();

// add favicon
// var favicon = require('serve-favicon');
// app.use(favicon(__dirname + '/src/media/favicon.ico'));

// use the directory that this file is in as the main directory
app.use(express.static(__dirname));

// simple response to the home directory of wherever this is served
// send response and load index.html
app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});

// have app listen on port 3000
var server = app.listen(3000, () => {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
