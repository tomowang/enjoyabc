var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      uuid: String,
      date: Date,
      filename: String,
      title: String
    });

module.exports = mongoose.model('Presentation', schema);
