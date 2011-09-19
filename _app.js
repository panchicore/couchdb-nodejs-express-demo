
/**
 * Module dependencies.
 */

var express = require('express');
var app = module.exports = express.createServer();

require("jinjs").registerExtension(".tpl");
var pwilang = require("pwilang");
require("jinjs").registerExtension(".pwx", function (txt) {
    return pwilang.parse(txt);
});


// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set("view options", { jinjs_pre_compile: function (str) { return parse_pwilang(str); } });
  app.set("view options", { layout: false });
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'your secret here' }));
  app.use(express.compiler({ src: __dirname + '/public', enable: ['less'] }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

app.get('/', function(req, res) {
        var my_template = require("./views/layout.tpl");
        var context = { foo: "foo", bar: "bar" };
        var result = my_template.render(context);
    });

//require('./controllers/main')(app) //
//require('./controllers/user')(app); //users
//require('./controllers/tags')(app); //tags

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
