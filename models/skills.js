var mongoose = require("mongoose");

var SkillsSchema = new mongoose.Schema({
  source: String,
  name: String,
});

module.exports = mongoose.model("Skills", SkillsSchema, "skills");
