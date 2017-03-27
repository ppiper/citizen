var mongoose = require('mongoose');

var EventSchema = new mongoose.Schema({
  category: Number, // environnement, social, culturel
  type: String, // ex: si environnement, qualité de l'air, etc...
  title: String,
  description: String,
  participants: Array, // les participants
  applicants:Array, // les candidats
  followers:Array, // les personnes intéressés
  photos: Array,
  videos: Array,
  location: Object,
  eventDate: [{ //date de meetup
    type: Date,
    default: Date.now
  }],
  created: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  type: String, // init, kickoff

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Event', EventSchema);
