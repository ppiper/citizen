var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  phone: String,
  isActive: {
    type: Boolean,
    default: true
  },
  username: { type: String, unique: true, required: true },
  // Nous choisisons de créer un objet `account` dans lequel nous stockerons les informations non sensibles
  profile:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile"
    }
  ,
  account: {
    zipCode: String,
    description: String,
    photos: [String],
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],
    projects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
      }
    ],
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skills"
      }
    ],
    donation: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donation"
      }
    ]
  }
});

UserSchema.plugin(passportLocalMongoose, {
  session: true,
});

module.exports = mongoose.model("User", UserSchema, "users");
