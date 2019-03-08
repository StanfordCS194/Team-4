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
*.
* /user/list     -  Returns an array containing all the User objects from the database.
*                   (JSON format)
* /user/:id      -  Returns the User object with the _id of :id. (JSON format).
* /boards//:id' - Returns a Board Object with _id :id.(JSON format)
*
*/

//set up mongodb

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://localhost/epiphanydb', { useMongoClient: true });

// Load the Mongoose schema for Konva-Canvas and Image
var Canvas = require('./schema/canvas.js');
var Img = require('./schema/img.js');
var Board = require('./schema/board.js');
var User = require('./schema/user.js');


// helpful installs
var async = require('async');
var fs = require('fs');

// build server application using express
var express = require('express');
var app = express();
// use the directory that this file is in as the main directory
app.use(express.static(__dirname));

// ################################# Server API #################################### //
app.get('/user/list', function (request, response) {
  User.find({}, function (err, info) {
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          console.error('Doing /user/list error:', err);
          response.status(500).send(JSON.stringify(err));
          return;
      }
      if (info.length === 0) {
          // Query didn't return an error but didn't find the SchemaInfo object - This
          // is also an internal error return.
          response.status(500).send('Missing SchemaInfo');
          return;
      }
      let parsedInfo = JSON.parse(JSON.stringify(info)), res = [];
      for (let i = 0; i < parsedInfo.length; i++) {
        res.push({
          _id: parsedInfo[i]['_id'],
          first_name: parsedInfo[i]['first_name'],
          last_name: parsedInfo[i]['last_name'],
        });
      }
      // We got the object - return it in JSON format.
      console.log('User List:', res);
      response.end(JSON.stringify(res));
  });
});

app.post('/admin/login', function(req, res) {
  let login_name = req.body.login_name;
  let password = req.body.password;
  User.find({login_name: login_name}, function (err, info) {
    if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /admin/login with login_name', login_name, ' received error:', err);
        res.status(400).send('Invalid login_name ' + login_name + ' received error ' + JSON.stringify(err));
        return;
    }
    if (info.length === 0) {
        // Query didn't return an error but didn't find the object - This
        // is also an internal error return.
        res.status(400).send('Login failed with login_name: ' + login_name);
        return;
    }
    // save session data
    let loggedUser = JSON.parse(JSON.stringify(info))[0];
    if (loggedUser.password !== password) {
      res.status(400).send('Incorrect Password');
    }
    console.log('loggin in', loggedUser);
    req.session.loggedIn = true;
    req.session.user = loggedUser;
    delete loggedUser.__v;
    res.end(JSON.stringify(loggedUser));
  });
});

app.post('/admin/logout', function(req, res) {
  req.session.loggedIn = false;
  req.session.user = null;
  res.end('logged out');
});

app.post('/user', function(req, res) {
  console.log({
    login_name: req.body.loginName,
    password: req.body.password1,
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    location: req.body.location,
    description: req.body.description,
  });
  User.find({login_name: req.body.loginName}, function (err, info) {
    if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /user received error:', err);
        res.status(400).send('Doing /user received error:' + JSON.stringify(err));
        return;
    }
    if (info.length !== 0) {
        // Query didn't return an error but didn't find the object - This
        // is also an internal error return.
        res.status(400).send('Someone already has login name: ' + req.body.loginName);
        return;
    }
  });
  User.create(
    {
      login_name: req.body.loginName,
      password: req.body.password1,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      location: req.body.location,
      description: req.body.description,
    },
    (err, response) => {
      console.log('result', response);
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          response.status(400).send('Doing /user, upload failed');
          console.error('Doing /user, upload failed');
          return;
      }
      if (!response) {
          // Query didn't return an error but didn't find the object - This
          // is also an internal error return.
          response.status(400).send('Doing /user, upload failed');
          console.error('Doing /user, upload failed');
          return;
      }
      res.end('User has been added!');
    }
  );
});


// ##################################################################### //



// have app listen on port 3000
var server = app.listen(3000, () => {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
