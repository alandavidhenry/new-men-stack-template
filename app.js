var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const User = require('./models/user');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const thingsRouter = require('./routes/things');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);

//express setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// method override setup
app.use(methodOverride('_method'));

// mongoose setup
mongoose.connect('mongodb://localhost:27017/new-men-stack-template');
mongoose.connection.on("error", console.error.bind(console, "connection error"));
mongoose.connection.once("open", () => {
  console.log("Database connected");
});

// session setup
const sessionConfig = {
  name: 'new-men-stack-template',
  secret: 'badsecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
    maxAge: (1000 * 60 * 60 * 24 * 7)
  }
}
app.use(session(sessionConfig));

app.use(flash());

// passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// local data passtrhough setup
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// routing
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/things', thingsRouter);

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
