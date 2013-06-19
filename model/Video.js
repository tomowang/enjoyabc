var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      date: Date,
      embed: String,
      title: String
    });

schema.methods.get_date = require('../utils/common').get_date;

module.exports = mongoose.model('Video', schema);
