var Article = require('../model').Article
  , exec = require('child_process').exec
  , path = require('path')
  , fs = require('fs')
  , util = require('util')
  , glob = require('glob')
  , uploadDir = path.join(__dirname, '..', 'public', 'downloads');

exports.list = function(req, res){
  console.log('list articles');
  Article.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('articles', {
      role: req.session.role,
      username: req.session.username,
      articles: docs
    });
  });
};

exports.get = function(req, res){
  var uuid = req.params.uuid;
  Article.findOne({uuid: uuid}, function(e, a){
    if(e){
      res.send(500);
      return;
    }
    if(!a){
      res.send(404);
      return;
    }
    res.download(path.join(uploadDir, uuid), a.filename, function(err){});
  });
};

exports.post = function(req, res){
  console.log('add new article');
  var fileType = 'application/pdf';
  if(req.files.article.type.substring(0, fileType.length) !== fileType){
    res.send(400, {'error': 'Invalid file type.'});
    fs.unlink(req.files.article.path, function(e){
      if (e) {
        console.log(e);
      }
    });
    return;
  }
  var oldPath = req.files.article.path
    , uuid = path.basename(oldPath)
    , thumbnail = path.join(path.dirname(oldPath), util.format('%s.png', uuid))
    , swfPath = path.join(path.dirname(oldPath), util.format('%s.swf', uuid));
  exec(util.format('pdf2swf -f -T 9 -t -s storeallcharacters %s -o %s', oldPath, swfPath), function(error, stdout, stderr){
    if(error){
      console.log(error);
      res.send(500);
      return;
    }
  exec(util.format('convert -thumbnail 300 %s[0] %s', oldPath, thumbnail), function(error, stdout, stderr){ // only the first page
    if(error){
      console.log(error);
      res.send(500);
      return;
    }
    fs.readdir(path.dirname(oldPath), function(err, files){
      if(err){
        res.send(500);
        return;
      }
      a = Article({
        uuid: uuid,
        date: new Date(),
        filename: req.files.article.name,
        title: req.body.title,
        size: req.files.article.size
      });
      a.save();
      res.send(201, {id: uuid});
    });
  });
  });
};

exports.del = function(req, res){
  console.log('delete one article');
  var uuid = req.params.uuid;
  Article.findOne({uuid: uuid}, function(err, a){
    if(err){
      res.send(500);
      return;
    }
    if(!a){
      res.send(404);
      return;
    }
    a.remove(function(err){
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
