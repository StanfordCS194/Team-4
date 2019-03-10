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

// Load the Mongoose schema for Konva-Canvas and Image
var Canvas = require('./schema/canvas.js');
var Img = require('./schema/img.js');
var Board = require('./schema/board.js');
var User = require('./schema/user.js');

var express = require('express');
var app = express();

// #################### New for proj7 ##########################
var session = require('express-session');
var bodyParser = require('body-parser');
var fs = require("fs");
var multer = require('multer');
var processFormBody = multer({storage: multer.memoryStorage()}).single('uploadedphoto');

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// ##############################################


// XXX - Your submission should work without this line
// var cs142models = require('./modelData/photoApp.js').cs142models;

mongoose.connect('mongodb://localhost/cs142project6', { useMongoClient: true });

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us.
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

// URL /admin/check - Check if the user is currently logged in
app.get('/admin/check', function(req, res) {
  console.log('logged in: ', req.session.loggedIn);
  console.log('with user: ', req.session.user);
  res.end(JSON.stringify(req.session.user));
});

// URL /admin/logout - Logout the current user
app.post('/admin/logout', function(req, res) {
  req.session.loggedIn = false;
  req.session.user = null;
  res.end('logged out');
});

// create a
app.post('/user', function(req, res) {
  let new_user = {
    username: req.body.username,
    password: req.body.password1,
    boards: [],
  };
  console.log(new_user);
  User.find({login_name: new_user.username}, function (err, info) {
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
    User.create({
      username: req.body.username,
      password: req.body.password1,
      boards: [],
    },
      (err, response) => {
        console.log('result', response);
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            res.status(400).send('Doing /user, upload failed');
            console.error('Doing /user, upload failed');
            return;
        }
        if (!response) {
            // Query didn't return an error but didn't find the object - This
            // is also an internal error return.
            res.status(400).send('Doing /user, upload failed');
            console.error('Doing /user, upload failed');
            return;
        }
    })
    .then((data)=>{
      console.log('created user: ', data);
      req.session.loggedIn = true;
      req.session.user = data;
      res.end(JSON.stringify(data));
    }).catch((err)=>{
      res.status(400).send('Doing /user, upload failed');
      console.error('Doing /user, upload failed');
      return;
    });
  });
});

/*
 * URL /user/:id - Return the information for User (id)
 */
app.get('/user/:id', function (request, response) {
    let id = request.params.id;
    if (!request.session.loggedIn) {
      console.error('must log in before accessing user content');
      response.status(401).send('must log in before accessing user content with /user/:id');
      return;
    }
    User.findById(id, function (err, info) {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user/:id with id', id, ' received error:', err);
            response.status(400).send('Invalid ID ' + JSON.stringify(id) + ' received error ' + JSON.stringify(err));
            return;
        }
        if (!info) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            response.status(400).send('Could not find user with id: ' + JSON.stringify(id));
            return;
        }
        let userDetails = JSON.parse(JSON.stringify(info));
        // get rid of __v from user details
        delete userDetails.__v;
        delete userDetails.password;
        console.log('User with id', id, 'has info', info);
        response.end(JSON.stringify(userDetails));
    });
});

// URL: /user/:uid/board create a new board for user :uid
app.post('/user/:uid/board', function(req, res) {
  // console.log(req.session.user, id, comment, new Date());
  Photo.updateOne(
    {_id: id},
    {$push: {
      comments: {
        comment: comment,
        date_time: new Date(),
        user_id: req.session.user._id
      }
    }},
    (err, response) => {
      console.log('result', response);
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          console.error('Doing /commentsOfPhoto/:photo_id with id', id, ' received error:', err);
          res.status(400).send('Invalid id ' + id + ' received error ' + JSON.stringify(err));
          return;
      }
      if (!response) {
          // Query didn't return an error but didn't find the object - This
          // is also an internal error return.
          res.status(400).send('Nothing with id ' + id + ' found');
          return;
      }
      res.end('added comment');
    }
  );
});


// ##################################################################### //



// have app listen on port 3000
var server = app.listen(3000, () => {
  var port = server.address().port;
  console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
