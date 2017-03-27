var mongoose = require("mongoose");

var DonationSchema = new mongoose.Schema({
  donateur:String,
  name: String, //nom de la donation
  type: String,
  value: Number,
  currency:String,
});

module.exports = mongoose.model("Donation", DonationSchema, "donation");
