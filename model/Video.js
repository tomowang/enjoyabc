var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      uuid: String,
      fmt: String,
      date: Date,
      //filename: String,
      //size: Number,
      link: String,
      title: String
    });

schema.methods.get_date = require('../utils/common').get_date;

module.exports = mongoose.model('Video', schema);
