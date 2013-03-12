exports.list = function(req, res){
  console.log('list articles');
};

exports.get = function(req, res){
  console.log('get ' +  req.params.tid);
};
