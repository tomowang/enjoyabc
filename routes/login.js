exports.get = function(req, res){
  res.render('login');
};

exports.post = function(req, res){
  console.log('user login');
  req.session.username = 'tomo';
  res.redirect('/');
};
