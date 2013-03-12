
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , login = require('./routes/login')
  , users = require('./routes/users')
  , articles = require('./routes/articles')
  , lectures = require('./routes/lectures')
  , presentations = require('./routes/presentations')
  , videos = require('./routes/videos')
  , http = require('http')
  , path = require('path');

var app = express()
  , server = http.createServer(app);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('tomo'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    switch (typeof a[key]) {
      // { '/path': { ... }}
      case 'object':
        app.map(a[key], route + key);
        break;
      // get: function(){ ... }
      case 'function':
        app[key](route, a[key]);
        break;
    }
  }
};

// DEAL - delete, edit, add, list
app.map({
  '/': {
    get: routes.index
  },
  '/login': {
    get: login.get,   // login page
    post: login.post  // do authentication
  },
  '/users': {
    post: users.add   // add user
  },
  '/articles': {
    get: articles.list,   // list all articles
    '/:tid': {
      get: articles.get  // get certain topic
    }
  },
  '/lectures': {
    get: lectures.list
  },
  '/presentations': {
    get: presentations.list
  },
  '/videos': {
    get: videos.list
  },
  '/contact': {
    get: require('./routes/contact').get  // contact us page
  }
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
