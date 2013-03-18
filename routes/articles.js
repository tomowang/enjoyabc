exports.list = function(req, res){
  console.log('list articles');
  var articles = []
    , i;
  for(i = 1; i <= 12; i++){
    articles.push('Topic ' + i);
  }
  res.render('articles', {articles: articles});
};

exports.get = function(req, res){
  console.log('get ' +  req.params.tid);
  res.send('article ' + req.params.tid);
};
