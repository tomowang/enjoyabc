var Presentation = require('../model').Presentation
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
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
  var oldPath = req.files.presentation.path
    , uuid = path.basename(oldPath)
    , thumbnail = path.join(path.dirname(oldPath), util.format('%s.%s', uuid, fmt));
  exec(util.format('convert %s $s', oldPath, thumbnail), function(error, stdout, stderr){
    if(error){
      res.send(500);
    }
    if(fs.existsSync(thumbnail)){
      fs.renameSync(thumbnail, path.join(path.dirname(oldPath), util.format('%s-0.%s', uuid, fmt))); // in case the pdf only contains one page
    }
    p = Presentation({
      uuid: uuid,
      date: new Date(),
      filename: req.files.presentation.name,
      title: req.body.title,
      size: req.files.presentation.size
    });
    p.save();
    res.send(201, {id: uuid});
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
      var filename = path.join(uploadDir, p.uuid)
        , thumbnail = path.join(uploadDir, util.format('%s-0.%s', uuid, fmt));
      fs.unlink(filename, function(e){
        if(e) console.log(e);
        fs.unlink(thumbnail, function(e){
          if(e) console.log(e);
          res.send(200);
        });
      });
    });
  });
}
