var mongoose = require("mongoose");

var ProfileSchema = new mongoose.Schema({
  source: String,
  name: String,
});

module.exports = mongoose.model("Profile", ProfileSchema, "profile");
