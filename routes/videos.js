var Video = require('../model').Video
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , fmt = 'jpg';

exports.list = function(req, res){
  console.log('list videos');
  Video.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('videos', {
      role: req.session.role,
      videos: docs
    });
  });
};

exports.post = function(req, res){
  console.log('add new video');
  var oldPath = req.files.video.path
    , newPath = path.join(path.dirname(oldPath), req.files.video.name)
    , uuid = path.basename(oldPath)
    , thumbnail = path.join(path.dirname(oldPath), util.format('%s.%s', uuid, fmt));
  fs.rename(oldPath, newPath, function(err){
    exec(util.format('avconv -i %s -ss 5 -r 1 -an -vframes 1 -f mjpeg %s', newPath, thumbnail), function(error, stdout, stderr){
      if(error){
        res.send(500);
      }
      v = Video({
        uuid: uuid,
        date: new Date(),
        filename: req.files.video.name,
        title: req.body.title,
        size: req.files.video.size
      });
      v.save();
      res.send(201, {id: uuid});
    });
  });
};
