
/*
 * GET home page.
 */

var Topic = require('../model').Topic;

exports.index = function(req, res){
  Topic.find({}, function(err, docs){
    if(err){
      res.render('index', {articles: []});
      return;
    }
    var articles = []
      , i
      , j
      , a;
    for(i = 0; i < docs.length; i++){
      a = docs[i].articles;
      for(j = 0; j < a.length; j++){
        articles.push(a[j]);
      }
    }
    articles.sort(function(m, n){
      return m.date - n.date;
    });
    articles = articles.slice(articles.length - 3);
    res.render('index', {
      articles: articles
    });
  });
};
