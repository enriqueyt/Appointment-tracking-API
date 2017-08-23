var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

require('./models/distributionLine');
require('./models/user');
require('./models/client');
require('./models/appointment');
require('./models/role');

var mongoose = require('mongoose');
var config = require('./config/config');
var utils = require('./libs/utils');

var mongooseConnection = utils.connectionDB(mongoose, config);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Database connection error:'));
db.once('open', console.error.bind(console, 'Connected to MongDB'));
var routes = require('./routes/index');

var authenticate = require('./routes/authenticate')(passport);
var appointment = require('./routes/appointment');
var client = require('./routes/client');
var distributionLine = require('./routes/distributionLine');
var initPassport = require('./routes/users')(passport);
var user = require('./routes/user');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

app.use(passport.initialize());
app.use(passport.session({
  secret : 'holis'
}));

app.use('/', routes);
app.use('/auth', authenticate);
app.use('/api/user', user);
app.use('/api/appointment', appointment);
app.use('/api/client', client);
app.use('/api/distributionLine', distributionLine);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
