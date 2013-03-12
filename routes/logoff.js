exports.get = function(req, res){
  if(req.session.username){
    req.session.destroy();
  }
  res.redirect('/');
};