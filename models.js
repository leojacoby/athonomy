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
  time: {type: String, required: true},
  location: {type: String, required: true},
  description: {type: String, required: true},
  cause: {type: String, required: true},
  private: {type: Boolean, required: true},
  measurement: {type: String, required: true},
  participants: [{
    type: Schema.ObjectId,
    ref: "Participant",
    default: [],
    required: true
  }],
  admin: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  }
});

const participantSchema = new Schema({
  participant: {
    type: Schema.ObjectId,
    ref: "User",
    required: true
  },
  event: {
    type: Schema.ObjectId,
    ref: "Event",
    required: true
  },
  joinTime: {type: Date, required: true},
  pledges: [{
    type: Schema.ObjectId,
    ref: "Pledge",
    required: true
  }]
});

const pledgeSchema = new Schema({
  participant: {
    type: Schema.ObjectId,
    ref: "Participant",
    required: true
  },
  event: {
    type: Schema.ObjectId,
    ref: "Event",
    required: true
  },
  pledgeTime: {type: Date, required: true},
  pledgeAmount: {type: Number, required: true},
  pledgePaid: {type: Boolean, default: false, required: true}
});

const User = mongoose.model('User', userSchema);

const Event = mongoose.model('Event', eventSchema);

const Participant = mongoose.model('Participant', participantSchema);

const Pledge = mongoose.model('Pledge', pledgeSchema);

module.exports = {
  User: User,
  Event: Event,
  Participant: Participant,
  Pledge: Pledge
};
