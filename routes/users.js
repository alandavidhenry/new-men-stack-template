var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


/* GET users listing. */
router.get('/index', catchAsync(async (req, res, next) => {
  const users = await User.find({});
	res.render('users/index', { users });
}));

/* GET register user page. */
router.get('/register', (req, res, next) => {
  res.render('users/register');
});

/* POST Add a new user to the database and redirect to home */
router.post('/register', catchAsync(async (req, res, next) => {
  try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
		  req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash('success', 'Welcome to ??????');
        res.redirect('/');
      })
	} catch (e) {
      req.flash('error', e.message);
      res.redirect('/');
  }
}));

/* GET login user page. */
router.get('/login', (req, res, next) => {
  res.render('users/login');
});

/* POST login user page. */
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/users/login' }), (req, res) => {
  req.flash('success', 'Welcome back');
  const redirectUrl = req.session.returnTo || '/';
  delete req.session.returnTo;
  res.redirect('/');
});

/* GET logout user page. */
router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'You are now logged out');
    res.redirect('/');
  });
});

module.exports = router;
