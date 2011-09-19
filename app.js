
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

// go couch
var cradle = require('cradle');
var db = new (cradle.Connection)().database('users');

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  //app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

require('./controllers/main')(app); //
require('./controllers/user')(app); //users
require('./controllers/tags')(app); //tags
require('./controllers/track')(app); //track

// events
io.sockets.on('connection', function(socket){

    //dile a todos quien es nuevo
    socket.on('new user', function(data){
        socket.broadcast.emit('new user', data);
    });

    socket.on('page view', function(data){
        db.view('visits/by_url', {group:true, key:data.href}, function(err, doc){
            socket.emit('page view count', {view_count:doc[0].value});
        });;
    });
});



app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
