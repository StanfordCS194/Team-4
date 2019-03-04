"use strict";

/*
 * Defined the Mongoose Schema and return a Model for a Images
 */

/* jshint node: true */

var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ImgSchema = new Schema({
    img: { data: Buffer, contentType: String}
}, {
    timestamps: true
});
module.exports = mongoose.model('Img', ImgSchema);
