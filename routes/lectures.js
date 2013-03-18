exports.list = function(req, res){
  console.log('list lectures');
  var lectures = []
    , i;
  for(i = 1; i <= 10; i++){
    lectures.push({
      date: i,
      topic: 'Topic ' + i,
      lecture: 'Lecture ' + i,
      location: 'Location ' + i
    });
  }
  res.render('lectures', {
    lectures: lectures
  });
};
