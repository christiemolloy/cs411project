var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var passport = require('passport');
var twitter = require('twitter');
var cookieParser = require('cookie-parser');
var logger = require('morgan')
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var captionRouter = require('./routes/caption');
var usersRouter = require('./routes/users');
//var imageRouter = require('./routes/image');
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');


var app = express();

// view engine setup

app.set('views', path.join(__dirname, 'views/'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


// required for passport
app.use(session({
    secret: 'SECRET',
    saveUninitialized: false,
    resave: true
})); // session secret

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));


app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/caption', captionRouter);
app.use('/profile', profileRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
