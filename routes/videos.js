var Video = require('../model').Video
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util');

exports.list = function(req, res){
  console.log('list videos');
  Video.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('videos', {
      role: req.session.role,
      username: req.session.username,
      videos: docs
    });
  });
};

exports.get = function(req, res){
  var uuid = req.params.uuid;
  Video.findOne({uuid: uuid}, function(e, v){
    if(e){
      res.send(500);
      return;
    }
    if(!v){
      res.send(404);
      return;
    }
    res.download(path.join(uploadDir, uuid), v.filename, function(err){});
  });
};

exports.post = function(req, res){
  console.log('add new video');
  //exec(util.format('avconv -i %s -ss 5 -r 1 -an -vframes 1 -f mjpeg %s', oldPath, thumbnail), function(error, stdout, stderr){
  v = Video({
    date: new Date(),
    title: req.body.title,
    embed: req.body.embed
  });
  v.save(function(err){
    if(err){
      res.send(500);
      return;
    }
    res.send(201, {id: v._id});
  });
};

exports.del = function(req, res){
  console.log('delete one video');
  var uuid = req.params.uuid;
  Video.findOne({_id: uuid}, function(err, v){
    if(err){
      res.send(500);
      return;
    }
    if(!v){
      res.send(404);
      return;
    }
    v.remove(function(err){
      if(err){
        res.send(500);
        return;
      }
      res.send(200);
    });
  });
}
