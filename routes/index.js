
/*
 * GET home page.
 */

var Article = require('../model').Article
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
    //picture: '',
    presentations: []
  };
  Article.find().sort('-date').exec(function(err, a){
    if(err){
      res.render('index', default_data);
      return;
    }
    default_data.articles = a;
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
          res.render('index', default_data);
          return;
          /*
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
          */
        });
      });
    });
  });
};
