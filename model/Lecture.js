var mongoose = require('mongoose')
  , moment = require('moment')
  , Schema = mongoose.Schema
  , schema = Schema({
      date: Date,
      topic: String,
      lecturer: String,
      location: String
    });

schema.methods.get_date = require('../utils/common').get_date;

module.exports = mongoose.model('Lecture', schema);
