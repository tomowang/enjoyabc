exports.get = function(req, res){
  console.log('get contact us page');
  res.render('contact', {
    role: req.session.role,
    username: req.session.username
  });
};
