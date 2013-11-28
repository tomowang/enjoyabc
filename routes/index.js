
/*
 * GET home page.
 */

var Topic = require('../model').Topic
  , Video = require('../model').Video
  , Presentation = require('../model').Presentation
  , Lecture = require('../model').Lecture
  , path = require('path')
  , fs = require('fs')
  , poolDir = path.join(__dirname, '..', 'public', 'pool');

exports.index = function(req, res){
  var default_data = {
    role: req.session.role,
    username: req.session.username,
    articles: [],
    videos: [],
    lectures: [],
    picture: '',
    presentations: []
  };
  Topic.find({}, function(err, docs){
    if(err){
      res.render('index', default_data);
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
      return n.date - m.date;
    });
    default_data.articles = articles;
    Video.find().sort('-date').exec(function(err, vs){
      if(err){
        res.render('index', default_data);
        return;
      }
      default_data.videos = vs;
      Presentation.find().sort('-date').exec(function(err, p){
        if(err){
          res.render('index', default_data);
          return;
        }
        default_data.presentations = p;    
        Lecture.find().sort('-date').exec(function(err, l){
          if(err){
            res.render('index', default_data);
            return;
          }
          default_data.lectures = l;    
          fs.readdir(poolDir, function(err, files){
            if(err){
              res.render('index', default_data);
              return;
            }
            var length = files.length
              , index;
            if(length > 0){
              index = Math.floor(Math.random()*length);
              default_data.picture = files[index];
            }
            res.render('index', default_data);
            return;
          });
        });
      });
    });
  });
};
