var express = require('express');
var router = express.Router();
var models = require('../models');
var Event = models.Event;

//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes

router.get('/', (req, res, next) => {
  res.render('home');
});

///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use((req, res, next) => {
  if (!req.user) {
    res.redirect('/login?endpoint='+req.originalUrl.slice(1));
  } else {
    return next();
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes

router.get('/newevent', (req, res, next) => {
  res.render('newevent', {
    username: req.user.username,
  });
});

router.post('/newevent', (req, res, next) => {
  let {name, organizer, date, location, description, cause, private, measurement} = req.body;
  if (private === "true") {
    private = true;
  } else {
    private = false;
  }
  new Event({
    name,
    organizer,
    date,
    location,
    description,
    cause,
    private,
    measurement
  }).save((err, event) => {
    if (err) {
      console.log("Error saving new event", err);
      res.status(500).redirect('/newevent');
    } else {
      console.log("New event saved!")
      res.status(200).redirect('/events/'+event._id);
    }
  })
})

///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
