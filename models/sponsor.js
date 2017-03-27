var mongoose = require("mongoose");

var Sponsor = new mongoose.Schema({
  source: String,
  name: String,
  image: String,//image uploadé via multer
  imageUrl: String,  // image via lien internet
});

module.exports = mongoose.model("Sponsor", Sponsor, "sponsor");
