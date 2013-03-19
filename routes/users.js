var User = require('../model').User
  , hash = require('../utils/pass').hash;

exports.add = function(req, res){
  console.log('add user');
  if(!req.body.username || !req.body.password){
    res.send(400);
    return;
  }
  User.findOne({username: req.body.username}, function(err, adventure){
    if(err){
      res.send(500);
      return;
    }
    if(adventure){
      res.send(400, {error: 'Username has been token'});
      return;
    }
    else{
      hash(req.body.password, function(err, salt, password){
        if(err){
          res.send(500);
          return;
        }
        var user = new User({
          username: req.body.username,
          salt: salt,
          password: password,
          role: 'user'  // use 'user as default'
        });
        user.save(function(err, u){
          if(err){
            res.send(500);
            return;
          }
          req.session.username = u.username;
          res.send(201, {'id': u.id});
        });
      });
    }
  });
};

exports.get = function(req, res){
  //res.render('users');
  res.send('users');
}
