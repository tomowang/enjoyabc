var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      uuid: String,
      ext: String,
      date: Date,
      filename: String,
      title: String
    });

module.exports = mongoose.model('Video', schema);
