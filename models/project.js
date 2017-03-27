var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
  category: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],
  type: String,
  title: String,
  description: String,
  comments:String,
  step: { type: String, default: "define" }, // etat du projet
  /*city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City"
  },*/
  donation: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation"
  }],
  city: String,
  loc: {
    type: [Number], // Longitude et latitude
    index: "2d" // Créer un index geospatial https://docs.mongodb.com/manual/core/2d/
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  resources: [{ // les ressources
      contributor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      isActive: {
        type: Boolean,
        default: false
      }
  }],
  believers: [{ // les personnes intéressés
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }],
  sponsors: { // les partenaires
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sponsor"
  },
  photos: Array,
  videos: Array,
  location: Object,
  startingDate: { //date de démarrage du projet
    type: Date,
    default: Date.now
  },
  estimatedDeadline: { //date prévisionnelle de fin de réalisation (lancement du service)
    type: Date,
    default: Date.now
  },
  closingDate: { // date réelle de fin de réalisation
    type: Date,
    default: Date.now
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },

});

module.exports = mongoose.model('Project', ProjectSchema);
