var Presentation = require('../model').Presentation
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , fmt = 'jpg';

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

exports.post = function(req, res){
  console.log('add new presentation');
  var oldPath = req.files.presentation.path
    , newPath = path.join(path.dirname(oldPath), req.files.presentation.name)
    , uuid = path.basename(oldPath)
    , thumbnail = path.join(path.dirname(oldPath), util.format('%s.%s', uuid, fmt));
  console.log(oldPath, newPath, uuid, thumbnail);
  fs.rename(oldPath, newPath, function(err){
    exec(util.format('convert %s $s', newPath, thumbnail), function(error, stdout, stderr){
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
  });
};
