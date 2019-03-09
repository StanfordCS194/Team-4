"use strict";
/*
 *  Defined the Mongoose Schema and return a Model for a User
 */
/* jshint node: true */

var mongoose = require('mongoose');

// create a schema
var boardSchema = new mongoose.Schema({
    name: String, // Name of board
    date: String, // Date of last interaction with board
    board_state: String,  // JSON description of the board state
});

// create model for board
var Board = mongoose.model('Board', boardSchema);
module.exports = Board;
