var User = require('../model').User
  , hash = require('../utils/pass').hash;

exports.add = function(req, res){
  console.log('add user');
  hash(req.body.password, function(err, salt, password){
    if(err){
      res.send(500);
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
      }
      console.log(u);
      res.send(201, {'id': u.id});
    });
  });
};

exports.get = function(req, res){
  //res.render('users');
  res.send('users');
}
