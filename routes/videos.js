var Video = require('../model').Video
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , glob = require('glob')
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
      username: req.session.username,
      videos: docs
    });
  });
};

exports.get = function(req, res){
  var uuid = path.basename(req.params.uuid, '.mp4');
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
  var fileType = 'video/mp4';
  if(req.files.video.type.substring(0, fileType.length) !== fileType){
    res.send(400, {'error': 'Invalid file type.'});
    fs.unlink(req.files.video.path, function(e){
      if (e) {
        console.log(e);
      }
    });
    return;
  }
  var oldPath = req.files.video.path
    , uuid = path.basename(oldPath)
    , thumbnail = path.join(path.dirname(oldPath), util.format('%s.%s', uuid, fmt))
    , thumbnailSmall = path.join(path.dirname(oldPath), util.format('%s.png', uuid));
  exec(util.format('avconv -i %s -ss 5 -r 1 -an -vframes 1 -f mjpeg %s', oldPath, thumbnail), function(error, stdout, stderr){
    exec(util.format('convert %s -resize 100x100\! %s', thumbnail, thumbnailSmall), function(error){
      if (error) {
        console.log(error);
      }
    });
    v = Video({
      uuid: uuid,
      date: new Date(),
      filename: req.files.video.name,
      title: req.body.title,
      size: req.files.video.size
      //embed: req.body.embed
    });
    v.save(function(err){
      if(err){
        res.send(500);
        return;
      }
      res.send(201, {id: v.uuid});
    });
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
      glob(uploadDir + util.format('/%s*', uuid), function(err, files){
        if(err){
          res.send(500);
          return;
        }
        for(var i = 0; i < files.length; i++){
          fs.unlink(files[i], function(e){
            if(e) console.log(e);
          });
        }
        res.send(200);
      });
    });
  });
}
