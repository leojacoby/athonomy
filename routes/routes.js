var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;
var Event = models.Event;
var Participant = models.Participant;
var Pledge = models.Pledge;

//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes

router.get('/', (req, res, next) => {
  res.render('home');
});

router.get('/events/:id', (req, res) => {
  console.log("got /events/:id")
  Event.findById(req.params.id)
  .then((event, err) => {
    if (err) {
      console.log("Error accessing event", err)
      res.status(500);
    } else if (!event) {
      console.log("Event not found")
      res.redirect('/');
    } else {
      console.log("Successfully got event, rendering...")
      let dateString = event.date.toString().split(' ');
      dateString.splice(4, 2);
      dateString = dateString.join(' ');
      let datetimeString = event.time + ' ' + dateString;
      res.render('event', {
        event: Object.assign(event, {datetimeString: datetimeString})
      });
    }
  })
})
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
  console.log("Post to /newevent");
  let {name, organizer, date, time, location, description, cause, private, measurement} = req.body;
  if (private === "true") {
    private = true;
  } else {
    private = false;
  }
  new Event({
    name,
    organizer,
    date,
    time,
    location,
    description,
    cause,
    private,
    measurement,
    admin: req.user._id
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

router.get('/events/admin/:id', (req, res) => {
  Event.findById(req.params.id)
  .populate("admin")
  .then((event, err) => {
    if (err) {
      console.log("Error accessing event", err)
      res.status(500);
    } else if (!event) {
      console.log("Event not found")
      res.redirect('/');
    } else {
      if (String(event.admin._id) === String(req.user._id)) {
        console.log("Successfully got event admin page, rendering...");
        let dateString = event.date.toString().split(' ');
        dateString.splice(4, 2);
        dateString = dateString.join(' ');
        let datetimeString = event.time + ' ' + dateString;
        // TODO: render a different admin page with access to all participants
        res.render('event', {
          event: Object.assign(event, {datetimeString: datetimeString})
        });
      } else {
        // boot them back
        console.log('event.admin._id', event.admin._id);
        console.log('req.user._id', req.user._id);
        res.redirect('/');
      }
    }
  })
})

router.post('/joinevent/:id', (req, res) => {
  // join event
  new Participant({
    participant: req.user._id,
    event: req.params.id,
    joinTime: new Date(),
  }).save((err, participant) => {
    if (err) {
      console.log("Could not save new participant", err);
    } else {
      Event.update({_id: req.params.id}, {$push:{participants: participant._id}}, (err, update) => {
        if (err) {
          console.log("Could not update event with new participant", err);
          res.send(err)
        } else if (!update) {
          console.log("something went wrong!", event)
        } else {
          console.log("New event updated with new participant!", update);
          // TODO: redirect to participant admin page
          res.redirect('/events/'+req.params.id);
        }
      })

      console.log("New participant saved!");
      // redirect to participant admin page
    }
  })
})

///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
