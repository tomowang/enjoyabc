exports.list = function(req, res){
  console.log('list videos');
  res.render('videos', {
    videos: [
      {
        uuid: 'ea53770d-0ef1-4738-b426-ca5392ec6ba1',
        title: 'Chrome',
        date: '2009-01-27',
        format: 'mp4'
      },
      {
        uuid: 'fcfa991e-f901-4f31-a5d1-0098d3dc6854',
        title: 'Oceans',
        date: '2010-05-18',
        format: 'mp4'
      }
    ]
  });
};
