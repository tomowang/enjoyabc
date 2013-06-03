var Topic = require('../model').Topic;

exports.list = function(req, res){
  console.log('list articles');
  Topic.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('articles', {
      role: req.session.role,
      username: req.session.username,
      topics: docs
    });
  });
};

exports.post = function(req, res){
  console.log('add a new topic');
  var articles = []
    , i;
  for(i = 0; i < req.body.title.length; i++){
    articles.push({
      date: new Date(),
      title: req.body.title[i],
      link: req.body.link[i]
    });
  }
  var topic = Topic({
    name: req.body.topic,
    articles: articles
  });
  topic.save(function(e, p){
    if(e){
      res.send(500);
      return
    }
    res.send(201, {id: topic._id});
  });
}

exports.del = function(req, res){
  console.log('delete topic: ' + req.params.tid);
  var id = req.params.tid;
  Topic.findById(id, function(e, t){
    if(e){
      res.send(500);
      return;
    }
    if(!t){
      res.send(404);
      return;
    }
    t.remove(function(err){
      if(e){
        res.send(500);
        return;
      }
      res.send(200);
    });
  });
};
