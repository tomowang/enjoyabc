var cluster = require('cluster')
  , numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
    console.log('fork a new one...');
    cluster.fork();
  });
}
else {
/**
 * Module dependencies.
 */

var express = require('express')
  , MongoStore = require('connect-mongo')(express)
  , settings = require('./utils/settings')
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
  app.use(express.bodyParser({
    //keepExtensions: true,
    uploadDir: path.join(__dirname, 'public', 'downloads')
  }));
  app.use(express.methodOverride());
  app.use(express.cookieParser('tomo'));
  app.use(express.session({
    secret: settings.cookie_secret,
    store: new MongoStore({
      db: settings.db,
      uri: settings.mongo_uri
    })
  }));
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.map = function(a, route){
  route = route || '';
  for (var key in a) {
    // get: function(){ ... }   single function
    // get: [function(){ ... }, function(){...}, ...]   function list
    if(Array.isArray(a[key]) || typeof a[key] === 'function'){
      app[key](route, a[key]);
    }
    // { '/path': { ... }}
    else if(typeof a[key] === 'object'){
      app.map(a[key], route + key);
    }
  }
};

var auth = function(){
  return function(req, res, next){
    if('username' in req.session){
      next();
    }
    else{
      res.redirect('/login');
    }
  }
};
var role_map = {
  'admin': 0, // most 
  'user': 1
};
var access_ctrl = function(role){
  return function(req, res, next){
    if('role' in req.session && role_map[role] >= role_map[req.session.role]){
      next();
    }
    else{
      res.send(403);
    }
  }
}

// DEAL - delete, edit, add, list
app.map({
  '/': {
    get: [auth(), routes.index]
  },
  '/login': {
    get: login.get,   // login page
    post: login.post  // do authentication, user login
  },
  '/logoff': {
    get: require('./routes/logoff').get
  },
  '/users': {
    get: users.get,
    post: users.add   // add user, register
  },
  '/articles': {
    get: [auth(), articles.list],
    post: [auth(), access_ctrl('admin'), articles.post],
    '/:tid': {
      delete: [auth(), access_ctrl('admin'), articles.del]
    }
  },
  '/lectures': {
    get: [auth(), lectures.list],
    post: [auth(), access_ctrl('admin'), lectures.post],
    '/:id': {
      delete: [auth(), access_ctrl('admin'), lectures.del]
    }
  },
  '/presentations': {
    get: [auth(), presentations.list],
    post: [auth(), access_ctrl('admin'), presentations.post],
    '/:uuid': {
      get: [auth(), presentations.get],
      delete: [auth(), access_ctrl('admin'), presentations.del]
    },
    '/topic': {
      put: [auth(), access_ctrl('admin'), routes.setTopic]
    }
  },
  '/media': {
    get: [auth(), videos.list],
    post: [auth(), access_ctrl('admin'), videos.post],
    '/:uuid': {
      get: [auth(), videos.get],
      delete: [auth(), access_ctrl('admin'), videos.del]
    }
  },
  '/downloads': {
    get: auth()
  },
  '/contact': {
    get: [auth(), require('./routes/contact').get]  // contact us page
  }
});

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

}
