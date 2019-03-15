'use strict';
/* jshint node: true */

/**
* This builds a server for the epiphany app and
* establishes a connection to the MongoDB named ''.
*
* To start the webserver run the command:
*    node server.js
* passing an argument such as:
*    node server.js 3001
* will start the server on port 3001
*
*
* This webServer exports the following URLs:
* /admin/login          -  Login to account with username and password
* /admin/logout         -  Logout currently logged in user
* /admin/check          -  Check if someone is logged in, returns id of loggedin usr
* /user                 -  Creates a new user
* /user/:id             -  Returns the User object with the _id of :id. (JSON format).
* /user/board           -  Saves the boards of logged in user
* /boardsOfUser/:id     -  Returns previews (thumbnail, date_time, _id, name) of boards of user with id :id
* /getBoard/:board_id   -  Returns board object of board with id :board_id
* /delete/:board_id     -  Deletes board with id :board_id
* /save/:board_id       -  Saves the board with id :board_id
* /createdBoard         -  Creates and saves new board and returns the board's _id
*/

// ############################## Set Up ###################################
//set up mongodb
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// connnect to epiphanydb
mongoose.connect('mongodb://localhost/epiphanydb', { useMongoClient: true });

// Load the Mongoose schema for a User, check ./schema/user.js for details
var User = require('./schema/user.js');

var express = require('express');
var app = express();
app.use(express.static(__dirname));

// usful installs
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '50mb', extended: true}));

// default to port 3000 if no port specified
let port = process.argv[2] || 3000;
// create a session using express-session
var session = require('express-session');
app.use(session({
  name: port,
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    path: "/",
  }
}));
// ######################### Set Up Complete #####################


// ################################# Server API #################################### //

// URL /admin/check - Login as a User
// parameters:
//    username - username of user to be logged in
  //  password
// returned data:
//  if logged in:
//    returns user object with username and _id
//  else:
//    returns undefined
app.post('/admin/login', function(req, res) {
  let username = req.body.username;
  let password = req.body.password;
  User.findOne({username: username}, function (err, info) {
    if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        // Error (500) error code.
        console.error('Doing /admin/login with login_name', username, ' received error:', err);
        res.status(400).send('Invalid login_name ' + JSON.stringify(username)+ ' received error ' + JSON.stringify(err));
        return;
    }
    if (!info) {
        // Query didn't return an error but didn't find the object - This
        // is also an internal error return.
        res.status(400).send('Login failed with login_name: ' + JSON.stringify(username));
        return;
    }
    // save session data
    let loggedUser = JSON.parse(JSON.stringify(info));
    if (loggedUser.password !== password) {
      res.status(400).send('Incorrect Password');
    }
    delete loggedUser.__v;
    delete loggedUser.password;
    delete loggedUser.boards;
    console.log('loggin in', loggedUser._id);
    req.session.logged_in_user = loggedUser;
    res.end(JSON.stringify(loggedUser));
  });
});

// URL /admin/check - Check if the user is currently logged in
// returned data:
//  if logged in:
//    returns user_id of logged in user
//  else:
//    returns undefined
app.get('/admin/check', function(req, res) {
  if (req.session.logged_in_user) {
    console.log('logged in with user: ', req.session.logged_in_user.username, req.session.logged_in_user._id);
    res.end(JSON.stringify(req.session.logged_in_user._id));
  }
  res.end();
});

// URL /admin/logout - Logout the current user
// set session cookie to null and logged in to false
app.post('/admin/logout', function(req, res) {
  req.session.logged_in_user = null;
  res.end('logged out');
});

// URL /user - create a user with username, password and an empty boards list
// parameters:
//  username - username of user to be created
//  password - password of created user
// returned data:
//  _id - the id of the new user
//  username - the username of the user
//  boards - a string representing the boards of the user, this is initialized to ''
app.post('/user', function(req, res) {
  let new_user = {
    username: req.body.username,
    password: req.body.password1,
    boards: '',
  };
  console.log(new_user);
  User.find({username: new_user.username}, function (err, info) {
    if (err) {
        // Query returned an error.  We pass it back to the browser with an Internal Service
        console.error('Doing /user received error:', err);
        res.status(400).send('Doing /user received error:' + JSON.stringify(err));
        return;
    }
    if (info.length !== 0) {
        // Query didn't return an error but didn't find the object - This
        // is also an internal error return.
        res.status(400).send('Someone already has login name: ' + JSON.stringify(req.body.loginName));
        return;
    }
    User.create({
      username: req.body.username,
      password: req.body.password1,
      boards: '',
    },
      (err, response) => {
        console.log('result', response);
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            res.status(400).send('Doing /user, upload failed', JSON.stringify(err));
            console.error('Doing /user, upload failed', err);
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
      let userDetails = JSON.parse(JSON.stringify(data));
      delete userDetails.__v;
      delete userDetails.password;
      delete userDetails.boards;
      req.session.logged_in_user = userDetails;
      res.end(JSON.stringify(userDetails));
    }).catch((err)=>{
      res.status(400).send('Doing /user, upload failed');
      console.error('Doing /user, upload failed');
      return;
    });
  });
});

/*
 * URL /user/:id - Returns the user details for user :id
 * return:
 *  - _id - the id of the found user
 *  - username - the username of the user
 *  - boards - the boards of the user, represented as list that is JSON.stringify()ed
 */
app.get('/user/:id', function (req, res) {
    let id = req.params.id;
    console.log(id);
    if (!req.session.logged_in_user) {
      console.error('must log in before accessing user content');
      res.status(401).send('must log in before accessing user content with /user/:id');
      return;
    }
    if (!req.session.logged_in_user._id == id) {
      console.error('cannot access account details of other users');
      res.status(401).send('cannot access account details of other users');
      return;
    }
    User.findById(id, function (err, info) {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /user/:id with id', id, ' received error:', err);
            res.status(400).send('Invalid ID ' + JSON.stringify(id) + ' received error ' + JSON.stringify(err));
            return;
        }
        if (!info) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            res.status(400).send('Could not find user with id: ' + JSON.stringify(id));
            return;
        }
        let userDetails = JSON.parse(JSON.stringify(info));
        // get rid of __v from user details
        delete userDetails.__v;
        delete userDetails.password;
        // console.log('User with id', id, 'has info', info);
        res.end(JSON.stringify(userDetails));
    });
});

// URL: /user/board saves the boards for user req.body.id
// parameters:
//  id - the id of the user that is saving. Should be the same as :id
//  board_representation - a JSON string representing the boards of the user
// returns:
//  a short messages and a 200 status
// app.post('/user/board', function(req, res) {
//   if (!req.session.loggedIn) {
//     console.error('must log in before accessing user content');
//     res.status(401).send('must log in before accessing user content with /user/:id');
//     return;
//   }
//   User.updateOne(
//     {_id: req.session.logged_in_user._id},
//     {$set: { boards: req.body.board_representation}},
//     (err, response) => {
//       if (err) {
//           // Query returned an error.  We pass it back to the browser with an Internal Service
//           // Error (500) error code.
//           console.error('Doing /commentsOfPhoto/:photo_id with id', req.session.logged_in_user._id, ' received error:', err);
//           res.status(400).send('Invalid id ' + JSON.stringify(req.session.logged_in_user._id) + ' received error ' + JSON.stringify(err));
//           return;
//       }
//       if (!response) {
//           // Query didn't return an error but didn't find the object - This
//           // is also an internal error return.
//           res.status(400).send('Nothing with id ' + JSON.stringify(req.session.logged_in_user._id) + ' found');
//           return;
//       }
//       res.end('saved boards');
//   });
// });


/*
 * URL /boardsOfUser/:id - Return the Boards for User (id)
 *  to be called to get preview of boards of the user.
 *  use for My Boards section of left sidebar
 *
 * parameters:
 *   none
 * returns: a list of the user boards, without content attached
 *  board = {
 *    name: set to name given in parameters
 *    thumbnail: set to thumbnail specified
 *    date_time: set to the date and time that the board was added to the database
 *    _id: automatically generated id for the new board
 *  }
 */
app.get('/boardsOfUser/:id', function (req, res) {
  console.log('doing /boardsOfUser/' + req.params.id);
    let id = req.params.id;
    if (!req.session.logged_in_user) {
      console.error('must log in before accessing boards');
      res.status(401).send('must log in before accessing boards with /boardsOfUser/:id');
      return;
    }
    if (req.session.logged_in_user._id !== id) {
      console.error('cannot access account details of other users');
      res.status(401).send('cannot access account details of other users');
      return;
    }
    User.findById(id, (err, info) => {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /boardsOfUser/:id with id', id, ' received error:', err);
            res.status(400).send('Invalid ID ' + JSON.stringify(id) + ' received error ' + JSON.stringify(err));
            return;
        }
        if (!info) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            res.status(400).send('Could not find photos of user with id: ' + JSON.stringify(id));
            return;
        }
        let userDetails = JSON.parse(JSON.stringify(info)), result = [];
        console.log('found user: ', userDetails._id);
        printBoards(userDetails.boards);
        for (let i = 0; i < userDetails.boards.length; i++) {
          result.push({
            _id: userDetails.boards[i]._id,
            name: userDetails.boards[i].name,
            date_time: userDetails.boards[i].date_time,
            thumbnail: userDetails.boards[i].thumbnail,
          });
        }
        res.end(JSON.stringify(result));
    });
});

/*
 * URL /getBoard/:board_id - Return the Board (board_id )
 *  finds board by using the currently logged in user
 *
 * parameters:
 *   none
 * returns:
 *  board = {
 *    name: set to name given in parameters
 *    content: set to content given in parameters
 *    thumbnail: set to thumbnail specified
 *    date_time: set to the date and time that the board was added to the database
 *    _id: automatically generated id for the new board
 *  }
 */
app.get('/getBoard/:board_id', function (req, res) {
    let board_id = req.params.board_id;
    let id = req.session.logged_in_user._id
    if (!req.session.logged_in_user) {
      console.error('must log in before accessing boards');
      res.status(401).send('must log in before accessing boards with /boardsOfUser/:id');
      return;
    }
    User.findById(id, (err, info) => {
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /getBoard/:board_id with board_id', board_id, ' received error:', err);
            res.status(400).send('Invalid ID ' + JSON.stringify(board_id) + ' received error ' + JSON.stringify(err));
            return;
        }
        if (!info) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            res.status(400).send('Could not find user with id: ' + JSON.stringify(id));
            return;
        }
        let userDetails = JSON.parse(JSON.stringify(info));
        let foundBoard = userDetails.boards.find((board) => {
          return board._id === board_id;
        });
        if (foundBoard) {
          res.end(JSON.stringify(foundBoard));
        } else {
          res.status(400).send('Could not find board with id: ' + JSON.stringify(board_id));
        }
    });
});


/*
 * URL /delete/:board_id - Delete the Board (board_id ) from the database
 *  finds board by using the currently logged in user
 *
 * parameters:
 *   none
 * returns:
 *  `deleted board ${board_id}`
 */
app.get('/delete/:board_id', function (req, res) {
    let board_id = req.params.board_id;
    console.log('\n attempting to DELETE, ', board_id);
    if (!req.session.logged_in_user) {
      console.error('must log in before accessing boards');
      res.status(401).send('must log in before accessing boards with /boardsOfUser/:id');
      return;
    }
    User.update(
      {_id: req.session.logged_in_user._id},
      {$pull: {
        boards: {
          _id: board_id
        }
      }},
       (err, info) => {
        console.log('deleted board info: ', info);
        if (err) {
            // Query returned an error.  We pass it back to the browser with an Internal Service
            // Error (500) error code.
            console.error('Doing /getBoard/:board_id with board_id', board_id, ' received error:', err);
            res.status(400).send('Invalid ID ' + JSON.stringify(board_id) + ' received error ' + JSON.stringify(err));
            return;
        }
        if (!info) {
            // Query didn't return an error but didn't find the SchemaInfo object - This
            // is also an internal error return.
            res.status(400).send('Could not find user with id: ' + JSON.stringify(req.session.logged_in_user._id));
            return;
        }
        res.end(`deleted board ${board_id}`);
    });
});

/*
 * URL /saveBoard/:board_id - Saves the state of the board with id board_id
 * paramters:
 *  name - desired name for board
 *  content - content for the board (optional, if not provied, does not update)
 *  thumbnail - thumbnail representing the board
 *  date_time - date of last edit for board
 * returns:
 *  'board saved'
 *
 */
app.post('/saveBoard/:board_id', function (req, res) {
  let board_id = req.params.board_id;
  console.log('\n /saveBoard/:board_id ======== ', board_id, req.body.name);
  if (!req.session.logged_in_user) {
    console.error('must log in before accessing photos');
    res.status(401).send('must log in before accessing photos with /saveBoard/:board_id');
    return;
  }
  let query = null;
  // if no content given, just update other 
  if (req.body.content.length < 10) {
    query = {$set: {
      "boards.$.date_time": req.body.date_time,
      "boards.$.name": req.body.name,
      "boards.$.thumbnail": req.body.thumbnail,
    }}
  } else {
    query = {$set: {
      "boards.$.date_time": req.body.date_time,
      "boards.$.name": req.body.name,
      "boards.$.content": req.body.content,
      "boards.$.thumbnail": req.body.thumbnail,
    }}
  }
  User.updateOne(
    {_id: req.session.logged_in_user._id, "boards._id": board_id},
    query, (err, info) => {
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          console.error('Doing /saveBoard/:board_id with id', board_id, ' received error:', err);
          res.status(402).send('Invalid ID ' + JSON.stringify(board_id) + ' received error ' + JSON.stringify(err));
          return;
      }
      if (!info) {
          // Query didn't return an error but didn't find the SchemaInfo object - This
          // is also an internal error return.
          res.status(403).send('Could not find photos of user with id: ' + JSON.stringify(board_id));
          return;
      }
      User.findById(req.session.logged_in_user._id, (err, info) => {
        let userDetails = JSON.parse(JSON.stringify(info));
        console.log('saved board', board_id, ' for : ', userDetails.username, ' num boards: ', userDetails.boards.length);
        printBoards(userDetails.boards);

        res.end('board saved');
      });
  });
});

// debugging function that prints out the name and _id of boards saved inside of a list
function printBoards(boards) {
  console.log('printing boards ===========', boards.length);
  if (boards.length !== 0) {
    for (var i = 0; i < boards.length; i++) {
      console.log('board ', i, ' : ', boards[i]._id, boards[i].name);
    }
  }
}


/*
 * URL /createBoard/:board_id - Creates a new board for the logged in user
 * paramters:
 *  name - desired name for board
 *  content - content for the board
 *  thumbnail - a thumbnail(png or jpeg file) for the board
 *  date_time - date time of last edit of board
 * returns:
 *  _id: automatically generated id for the new board
 *
 */
app.post('/createdBoard', function (req, res) {
  if (!req.session.logged_in_user) {
    console.error('must log in before saving a board');
    res.status(401).send('must log in before accessing photos with /createdBoard');
    return;
  }
  let user_id = req.session.logged_in_user._id;
  User.updateOne(
    {_id: user_id},
    {$push: {
      boards: {
        date_time: req.body.date_time,
        name: req.body.name,
        content: req.body.content,
        thumbnail: req.body.thumbnail
      }
    }},
    function (err, info) {
      console.log('result of update: ', info);
      if (err) {
          // Query returned an error.  We pass it back to the browser with an Internal Service
          // Error (500) error code.
          console.error('Doing /createdBoard received error:', err);
          res.status(400).send('Received error ' + JSON.stringify(err));
          return;
      }
      if (!info) {
          // Query didn't return an error but didn't find the SchemaInfo object - This
          // is also an internal error return.
          res.status(400).send('Could not created new board');
          return;
      }
      User.findById(user_id, (err, info) => {
        let userDetails = JSON.parse(JSON.stringify(info));
        console.log('created board for : ', userDetails.username, ' num boards: ', userDetails.boards.length);
        printBoards(userDetails.boards);

        res.end(JSON.stringify(userDetails.boards[userDetails.boards.length - 1]._id));
      });
  });
});

// ##################################################################### //
app.listen(port, function () {
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
