var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      uuid: String,
      ext: String,
      date: Date,
      filename: String,
      title: String
    });

schema.methods.get_date = require('../utils/common').get_date;

module.exports = mongoose.model('Video', schema);
