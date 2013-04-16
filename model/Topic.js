var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , schema = Schema({
      name: String,
      articles: [Schema({
          date: Date,
          title: String,
          link: String
        })
      ]
    });

module.exports = mongoose.model('Topic', schema);
