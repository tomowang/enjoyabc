
/*
 * GET home page.
 */

var Topic = require('../model').Topic
  , Video = require('../model').Video
  , Presentation = require('../model').Presentation
  , Lecture = require('../model').Lecture
  , path = require('path')
  , fs = require('fs')
  , ptopic_path = path.join(__dirname, '..', 'ptopic');

fs.exists(ptopic_path, function(exists){
  if(!exists){
    fs.writeFile(ptopic_path, '', function(err){  // create one when not exist
      if(err){
        console.log(err);
      }
    });
  }
});

exports.index = function(req, res){
  var default_data = {
    role: req.session.role,
    username: req.session.username,
    topic: '',
    articles: [],
    videos: [],
    lectures: [],
    presentations: []
  };
  fs.readFile(ptopic_path, function(err, data){   // get the presentation topic from file
    if(err){
      console.log(err);
    }
    else{
      default_data.topic = data;
    }
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
          res.render('index', default_data);
        });
      });
    });
  });
  });
};

exports.setTopic = function(req, res){
  fs.writeFile(ptopic_path, req.body.value, function(err){
    if(err){
      console.log(err);
      res.send(500, {error: true});
    }
    res.send(200, {error: false});
  });
}
