// Add Passport-related auth routes here.
var express = require('express');
var router = express.Router();
var models = require('../models');

module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  router.post('/signup', function(req, res) {
    // validation step
    if (req.body.password!==req.body.passwordRepeat) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      username: req.body.username,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password
    });
    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {
    var endpoint = req.query.endpoint || "";
    if (endpoint.length) {
      var action = "/login/?endpoint="+endpoint;
    } else {
      var action = "/login";
    }
    res.render('login', {
      formAction: action
    });
  });

  // POST Login page
  router.post('/login', (req, res) => {
    passport.authenticate('local', {
      successRedirect: '/'+req.query.endpoint,
      failureRedirect: '/login'
    })(req, res);
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
};
