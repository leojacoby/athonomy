const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
});

const eventSchema = new Schema({
  name: {type: String, required: true},
  organizer: {type: String, required: true},
  date: {type: Date, required: true},
  location: {type: String, required: true},
  description: {type: String, required: true},
  cause: {type: String, required: true},
  private: {type: Boolean, required: true}
})

const User = mongoose.model('User', userSchema);

const Event = mongoose.model('Event', eventSchema);

module.exports = {
    User: User,
    Event: Event
};
