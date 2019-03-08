"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var boardSchema = new mongoose.Schema({
    board_name: String, // First name of the user.
    board: String,  // A brief user description
});

// the schema is useless so far
// we need to create a model using it
var Board = mongoose.model('Board', boardSchema);

// make this available to our users in our Node applications
module.exports = Board;
