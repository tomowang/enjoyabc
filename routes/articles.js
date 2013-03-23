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
      topics: docs
    });
  });
};

exports.get = function(req, res){
  console.log('get ' +  req.params.tid);
  res.send('article ' + req.params.tid);
};
