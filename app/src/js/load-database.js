"use strict";

/* jshint node: true */
/* global Promise */

/*
 * This Node.js program loads a default list of users as Mongoose defined objects
 * in a MongoDB database. It can be run with the command:
 *     node loadDatabase.js
 * be sure to have an instance of the MongoDB running on the localhost.
 *
 * This file is used for testing purposes to refresh the databse with a few users
 *
 */


 // Get the magic models we used in the previous projects.
 var testData = require('./testData.js').testData;

 // We use the Mongoose to define the schema stored in MongoDB.
 var mongoose = require('mongoose');

 mongoose.connect('mongodb://localhost/epiphanydb');

 // Load the Mongoose schema for Use and Photo
 var User = require('../../schema/user.js');

 // We start by removing anything that existing in the collections.
 var removePromises = [User.remove({})];

 Promise.all(removePromises).then(function () {

     // Load the users into the User. Mongo assigns ids to objects so we record
     // the assigned '_id' back into the cs142model.userListModels so we have it
     // later in the script.

     var userModels = testData.userListModel();
     var mapFakeId2RealId = {}; // Map from fake id to real Mongo _id
     var userPromises = userModels.map(function (user) {
         return User.create({
             username: user.username,
             password: user.password,
             boards: []
         }).then(function (userObj) {
             // Set the unique ID of the object. We use the MongoDB generated _id for now
             // but we keep it distinct from the MongoDB ID so we can go to something
             // prettier in the future since these show up in URLs, etc.
             userObj.save();
             mapFakeId2RealId[user._id] = userObj._id;
             user.objectID = userObj._id;
             console.log('Adding user:', user.username + ' ' + user.password, ' with ID ',
                 user.objectID);
         }).catch(function (err){
             console.error('Error create user', err);
         });
     });

     Promise.all(userPromises).then(function () {
         mongoose.disconnect();
     });

 }).catch(function(err){
     console.error('Error create schemaInfo', err);
 });
