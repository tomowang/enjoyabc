var mongoose = require('mongoose')
  , settings = require('../utils/settings');

mongoose.connect(settings.mongo_uri + settings.db);

exports.User = require('./User');
//exports.Topic = require('./Topic');
exports.Article = require('./Article');
exports.Lecture = require('./Lecture');
exports.Video = require('./Video');
exports.Presentation = require('./Presentation');
