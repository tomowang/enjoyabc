var Presentation = require('../model').Presentation
  , path = require('path')
  , mv = require('mv')
  , fs = require('fs')
  , util = require('util')
  , glob = require('glob')
  , uploadDir = path.join(__dirname, '..', 'public', 'downloads')
  , poolDir = path.join(__dirname, '..', 'public', 'pool');

exports.list = function(req, res){
  console.log('list pictures');
  fs.readdir(poolDir, function(err, files){
    if(err){
      res.send(500);
      return;
    }
    res.render('pictures', {
      role: req.session.role,
      username: req.session.username,
      pictures: files
    });
  });
};

exports.post = function(req, res){
  console.log('add new pictures');
  var fileType = 'image'
    , pictures = req.files.pictures
    , i, p, oldPath, filename, ids = [];
  if(!Array.isArray(pictures)){
    pictures = [pictures];
  }
  for(i=0; i< pictures.length; i++){
    p = pictures[i];
    if(p.type.substring(0, fileType.length) !== fileType){
      continue;
    }
    oldPath = p.path;
    filename = path.basename(oldPath);
    ids.push(filename);
    mv(p.path, path.join(poolDir, filename), function(err){
      console.log(err);
    });
  }
  res.send(201, {id: ids});
  return;
};

exports.del = function(req, res){
  console.log('delete one picture');
  var filename = req.params.filename;
  fs.unlink(path.join(poolDir, filename), function(err){
    if(err){
      console.log(err);
      res.send(500);
      return;
    }
    res.send(200);
    return;
  });
};

exports.next = function(req, res){
  console.log('get next random picture');
  var current = req.params.filename
    , next = '';
  fs.readdir(poolDir, function(err, files){
    if(err){
      res.send(500);
      return;
    }
    var length = files.length
      , index;
    if(length > 0){
      do{
        index = Math.floor(Math.random()*length);
        next = files[index];
      }
      while(next === current);
      res.send(200, {filename: next});
      return;
    }
    res.send(404);
    return;
  });
};
