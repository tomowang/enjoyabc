var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      uuid: String,
      date: Date,
      filename: String,
      size: Number,
      count: Number,
      title: String
    });

schema.methods.get_date = require('../utils/common').get_date;

module.exports = mongoose.model('Presentation', schema);
