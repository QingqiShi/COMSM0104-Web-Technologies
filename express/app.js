var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var crypto = require('crypto');

var index = require('./routes/index');
var game = require('./routes/game');
var browse = require('./routes/browse');
var about = require('./routes/about');
var signin = require('./routes/signin');
var signup = require('./routes/signup');
var signout = require('./routes/signout');
var publish = require('./routes/publish');

var hbs = require('hbs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: crypto.randomBytes(128).toString('base64')
}));

// Handlebars partial directory
hbs.registerPartials(__dirname + '/views/partials');

// Block and extend functionalities
var blocks = {};

hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});

hbs.registerHelper("formatDate", function(datetime, format) {
    var months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    var d = new Date();
    d.setTime(datetime);

    var n = d.getDate() + " " + months[d.getMonth()] + " " + d.getFullYear();
    return n;
});

app.use('/', index);
app.use('/index.html', index);
app.use('/game.html', game);
app.use('/browse.html', browse);
app.use('/about.html', about);
app.use('/signin.html', signin);
app.use('/signup.html', signup);
app.use('/signout.html', signout);
app.use('/publish.html', publish);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
