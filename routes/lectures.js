var Lecture = require('../model').Lecture;

exports.list = function(req, res){
  console.log('list lectures');
  Lecture.find({}, function(err, docs){
    if(err){
      res.send(500);
      return;
    }
    res.render('lectures', {
      lectures: docs
    });
  });
};
