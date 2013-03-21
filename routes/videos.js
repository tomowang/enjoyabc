var Video = require('../model').Video;

exports.list = function(req, res){
  console.log('list videos');
  Video.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('videos', {
      videos: docs
    });
  });
};

exports.post = function(req, res){
  console.log('add new video');
};
