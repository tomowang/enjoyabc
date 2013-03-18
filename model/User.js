var mongoose = require('mongoose')
  , schema = mongoose.Schema({
      username: String,
      salt: String,
      password: String,
      role: String  // admin or user
    });

module.exports = mongoose.model('User', schema);
