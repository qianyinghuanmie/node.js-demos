var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var login = require('./routes/login');

var app = express();

var ejs = require('ejs');
// 数据库的连接
var MongoClient = require('mongodb').MongoClient,
  test = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/test';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  var adminDb = db.admin();

  // Add the new user to the admin database
  adminDb.addUser('admin11', 'admin11', function(err, result) {

    // Authenticate using the newly added user
    adminDb.authenticate('admin11', 'admin11', function(err, result) {
      test.ok(result);

      adminDb.removeUser('admin11', function(err, result) {
        test.ok(result);
        db.close();
      });
    });
  });
});
// 数据库的连接
app.engine('html', ejs.__express);
app.set('view engine', 'html');

// app.engine('handlebars', exphbs({defaultLayout: 'main'}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'handlebars');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/login', login);

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
