exports.list = function(req, res){
  console.log('list articles');
  res.send('articles');
};

exports.get = function(req, res){
  console.log('get ' +  req.params.tid);
  res.send('article ' + req.params.tid);
};
