"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

// board schema
var boardSchema = new mongoose.Schema({
    board_name: String, // First name of the user.
    board: String,  // A brief user description
});

// create a schema
var userSchema = new mongoose.Schema({
    first_name: String, // First name of the user.
    last_name: String,  // Last name of the user.
    profile_pic: String,    // Location  of the user.
    boards: [boardSchema],  // A brief user description
    occupation: String    // Occupation of the user.
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
