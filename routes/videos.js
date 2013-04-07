var Video = require('../model').Video
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , fmt = 'jpg'
  , uploadDir = path.join(__dirname, '..', 'public', 'downloads');

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
  var fileType = 'image';
  if(req.files.thumbnail.type.substring(0, fileType.length) !== fileType){
    res.send(400, {'error': 'Invalid file type.'});
    return;
  }
  var oldPath = req.files.thumbnail.path
    , uuid = path.basename(oldPath)
    , filename = req.files.thumbnail.name
    , fmt = path.extname(filename)  // will be '.jpg' or so
    , thumbnail = oldPath + fmt;
  fs.rename(oldPath, thumbnail, function(error){
  //exec(util.format('avconv -i %s -ss 5 -r 1 -an -vframes 1 -f mjpeg %s', oldPath, thumbnail), function(error, stdout, stderr){
    if(error){
      res.send(500);
      return;
    }
    v = Video({
      uuid: uuid,
      fmt: fmt,
      date: new Date(),
      //filename: req.files.video.name,
      title: req.body.title,
      link: req.body.link
      //size: req.files.video.size
    });
    v.save();
    res.send(201, {id: uuid});
  });
};

exports.del = function(req, res){
  console.log('delete one video');
  var uuid = req.params.uuid;
  Video.findOne({uuid: uuid}, function(err, v){
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
      //var filename = path.join(uploadDir, v.uuid)
      var thumbnail = path.join(uploadDir, util.format('%s%s', uuid, v.fmt));
      fs.unlink(thumbnail, function(e){
        if(e) console.log(e);
        res.send(200);
      });
    });
  });
}
