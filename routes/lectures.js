var Lecture = require('../model').Lecture
  , moment = require('moment');

exports.list = function(req, res){
  console.log('list lectures');
  Lecture.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('lectures', {
      role: req.session.role,
      lectures: docs
    });
  });
};

exports.post = function(req, res){
  console.log('add new lecture');
  var date = req.body.date
    , topic = req.body.topic
    , lecturer = req.body.lecturer
    , location = req.body.location;
  if(!date || !topic || !lecturer || !location){
    res.send(400);
    return
  }
  var lecture = Lecture({
    date: moment(date)._d,
    topic: topic,
    lecturer: lecturer,
    location: location
  });
  lecture.save(function(e, product){
    if(e){
      res.send(500);
      return;
    }
    res.send(201, {id: product.id});
  });
};

exports.del = function(req, res){
  console.log('delete one lecture');
  var id = req.params.id;
  Lecture.findById(id, function(e, lecture){
    if(e){
      res.send(500);
      return;
    }
    if(!lecture){
      res.send(404);
      return;
    }
    lecture.remove(function(e){
      if(e){
        res.send(500);
        return;
      }
    });
    res.send(200);
  });
};
