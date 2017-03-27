var mongoose = require("mongoose");

var CategorySchema = new mongoose.Schema({
  source: String,
  name: String,
});

module.exports = mongoose.model("Category", CategorySchema, "skills");
