var User = require('../model').User
  , hash = require('../utils/pass').hash;

exports.get = function(req, res){
  res.render('login');
};

exports.post = function(req, res){
  console.log('user login');
  if(!req.body.username || !req.body.password){
    res.render('login', {
      error: 'Please provide valid input'
    });
    return;
  }
  User.findOne({username: req.body.username}, function(err, user){
    if(err){
      res.render('login', {
        error: 'Server error!'
      });
      return;
    }
    if(!user){
      console.log('no such user: ' + req.body.username);
      res.render('login', {
        error: 'Invalid username or password'
      });
      return;
    }
    hash(req.body.password, user.salt, function(err, hash){
      if(err){
        res.render('login', {
          error: 'Server error!'
        });
        return;
      }
      if(hash !== user.password){
        console.log('invalid password');
        res.render('login', {
          error: 'Invalid username or password'
        });
        return;
      }
      req.session.username = user.username;
      req.session.role = user.role;
      res.redirect('/');
    });
  });
};
