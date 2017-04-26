// Le package `dotenv` permet de pouvoir definir des variables d'environnement dans le fichier `.env`
// Nous utilisons le fichier `.slugignore` afin d'ignorer le fichier `.env` dans l'environnement Heroku
require("dotenv").config();

// Le package `mongoose` est un ODM (Object-Document Mapping) permettant de manipuler les documents de la base de données comme si c'étaient des objets
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) console.error("Could not connect to mongodb.");
});

var express = require('express');
var expressSession = require('express-session');

var MongoStore = require('connect-mongo')(expressSession);
//var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/citizencare');

var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

var User = require('./models/User');
var Project = require('./models/Project');
var Event = require('./models/Event');
var City = require('./models/City');
var Sponsor = require('./models/Sponsor');

// var Article = require('./models/article');



var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var truncate = require('truncate');
app.locals.truncate = truncate;

var _ = require('lodash');
app.locals._ = _;

// active la gestion de la session
app.use(expressSession({
  secret: 'thereactor09',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection})
}));

// active passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // JSON.stringify
passport.deserializeUser(User.deserializeUser()); // JSON.parse


// Les routes sont séparées dans plusieurs fichiers
var coreRoutes = require("./routes/core.js");
var userRoutes = require("./routes/user.js");
var projectRoutes = require("./routes/project.js");
// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
app.use("/", coreRoutes); // renommer les routes ulterieurement
app.use("/", userRoutes);
app.use("/", projectRoutes);

// Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront une erreur 404
app.all("*", function(req, res) {
  res.status(404).json({ error: "Not Found" });
});

// Le dernier middleware de la chaîne gérera les d'erreurs
// Ce `error handler` doit définir obligatoirement 4 paramètres
// Définition d'un middleware : https://expressjs.com/en/guide/writing-middleware.html
app.use(function(err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  if (process.env.NODE_ENV === "production") err = "An error occurred";
  res.json({ error: err });
});

app.listen(process.env.PORT, function() {
  console.log(`running on port ${process.env.PORT}`);
});
//
// app.listen(3000, function() {
//   console.log('server is listening');
// });
