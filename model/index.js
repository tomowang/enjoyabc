var mongoose = require('mongoose')
  , settings = require('../utils/settings');

mongoose.connect(settings.mongo_uri + settings.db);

exports.User = require('./User');
