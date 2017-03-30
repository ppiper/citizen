var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema({
  source: String,
  name: String,
  isAdmin: {
    type: Boolean,
    default: false
  },
  isSponsor: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("Profile", ProfileSchema, "profile");
