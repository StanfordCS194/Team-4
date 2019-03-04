'use strict';
/* jshint node: true */

/*
* This builds a server for the epiphany app and
* establishes a connection to the MongoDB named ''.
*
* To start the webserver run the command:
*    node server.js
*
*
* This webServer exports the following URLs:
* /              -  Returns a text status message.  And index.html
* /api/test     -  Returns the SchemaInfo object from the database (JSON format).  Good
*
*/

//set up mongodb
let runServer = false;

if (runServer) {
  var mongoose = require('mongoose');
  mongoose.Promise = require('bluebird');
  mongoose.connect('mongodb://localhost/epiphanydb', { useMongoClient: true });

  // Load the Mongoose schema for Konva-Canvas and Image
  var Canvas = require('./schema/canvas.js');
  var Img = require('./schema/img.js');
}



// helpful installs
var async = require('async');
var fs = require('fs');

// build server application using express
var express = require('express');
var app = express();
// use the directory that this file is in as the main directory
app.use(express.static(__dirname));


// have app listen on port 3000
var server = app.listen(3000, () => {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
