
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , Memore = require('./lib/memore')
  , argv = require('optimist')
           .usage('Usage $0 -d [dir]')
           .demand(['d'])
           .describe('d', 'data dir')
           .argv;


var app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

var memore = new Memore(argv.d);

app.configure(function(){
  io.set('log level', 1);
  app.locals.view_prefix = '/view/';
  app.use(function(req, res, next){
    req.memore = memore;
    next();
  });
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());

  app.use(function(req, res, next){
    if(req.path.indexOf(app.locals.view_prefix) == 0){
      var path =  req.path.substr(6);
      path = decodeURI(path);
      req.wiki_path = '/' + path;
    }
    next();
    return;
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get(app.locals.view_prefix + '*.pukiwiki', routes.pukiwiki);
app.get(app.locals.view_prefix + '*', routes.index);

server.listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on('connection', memore.clients.connection_handler());