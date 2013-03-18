exports.list = function(req, res){
  console.log('list presentations');
  res.render('presentations', {
    presentations: [
      {
        title: 'Introduction to TeX and ConTeXt',
        date: 'February 22, 2013',
        uuid: 'a2471a9a-546a-467c-9695-d498e33be5ee'
      },
      {
        title: 'node.js',
        date: 'April 17, 2010',
        uuid: 'b4ca06e4-703b-4798-ad97-54920b8a26c3'
      }
    ]
  });
};
