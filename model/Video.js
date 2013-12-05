var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      uuid: String,
      date: Date,
      filename: String,
      size: Number,
      //embed: String,
      title: String
    });

schema.methods.get_date = require('../utils/common').get_date;
schema.methods.get_size = require('../utils/common').get_size;

module.exports = mongoose.model('Video', schema);
