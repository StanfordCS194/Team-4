"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

// board schema
var boardSchema = new mongoose.Schema({
    name: String, // Name of board
    date: String, // Date of last interaction with board
    board_state: String,  // JSON description of the board state
});

// create a schema for usr
var userSchema = new mongoose.Schema({
    username: String, // Username of User
    password: String, // User's password
    boards: [boardSchema],  // A brief user description
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
