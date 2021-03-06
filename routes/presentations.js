var Presentation = require('../model').Presentation
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , glob = require('glob')
  , fmt = 'jpg'
  , uploadDir = path.join(__dirname, '..', 'public', 'downloads');

exports.list = function(req, res){
  console.log('list presentations');
  Presentation.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('presentations', {
      role: req.session.role,
      username: req.session.username,
      presentations: docs
    });
  });
};

exports.get = function(req, res){
  var uuid = req.params.uuid;
  Presentation.findOne({uuid: uuid}, function(e, p){
    if(e){
      res.send(500);
      return;
    }
    if(!p){
      res.send(404);
      return;
    }
    res.download(path.join(uploadDir, uuid), p.filename, function(err){});
  });
};

exports.post = function(req, res){
  console.log('add new presentation');
  var fileType = 'application/pdf';
  if(req.files.presentation.type.substring(0, fileType.length) !== fileType){
    res.send(400, {'error': 'Invalid file type.'});
    fs.unlink(req.files.presentation.path, function(e){
      if (e) {
        console.log(e);
      }
    });
    return;
  }
  var oldPath = req.files.presentation.path
    , uuid = path.basename(oldPath)
    , thumbnail = path.join(path.dirname(oldPath), util.format('%s.%s', uuid, fmt));
  exec(util.format('convert %s $s', oldPath, thumbnail), function(error, stdout, stderr){
    if(error){
      res.send(500);
      return;
    }
    if(fs.existsSync(thumbnail)){
      fs.renameSync(thumbnail, path.join(path.dirname(oldPath), util.format('%s-0.%s', uuid, fmt))); // in case the pdf only contains one page
    }
    fs.readdir(path.dirname(oldPath), function(err, files){
      if(err){
        res.send(500);
        return;
      }
      var count = files.filter(function(fname){
        return fname.indexOf(uuid + '-') === 0;
      }).length;
      p = Presentation({
        uuid: uuid,
        date: new Date(),
        filename: req.files.presentation.name,
        title: req.body.title,
        count: count,
        size: req.files.presentation.size
      });
      p.save();
      res.send(201, {id: uuid});
    });
  });
};

exports.del = function(req, res){
  console.log('delete one presentation');
  var uuid = req.params.uuid;
  Presentation.findOne({uuid: uuid}, function(err, p){
    if(err){
      res.send(500);
      return;
    }
    if(!p){
      res.send(404);
      return;
    }
    p.remove(function(err){
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
