var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      date: Date,
      topic: String,
      lecturer: String,
      location: String
    });

module.exports = mongoose.model('Lecture', schema);
