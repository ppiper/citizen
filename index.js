var express = require('express');
var expressSession = require('express-session');
var multer = require('multer');
var upload = multer({
  dest: 'public/uploads/'
});
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var passport = require('passport');
var bodyParser = require('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');

var User = require('./models/user');
var Project = require('./models/project');
var Event = require('./models/event');
var City = require('./models/city');
var Sponsor = require('./models/sponsor');

// var Article = require('./models/article');

mongoose.connect('mongodb://localhost:27017/citizencare');

var app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var truncate = require('truncate');
app.locals.truncate = truncate;

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


var photosToArray = (req, res, next) => {

  var files = req.files;
  var photos = [];
  console.log(req.files);
  for (var i = 0; i < files.length; i++) {
    photos.push(files[i].filename);
  }
  req.photos = photos;
  console.log(photos);
  next();
}

//affiche la liste des projets disponibles
function getProjects(req, res, next) {
  // retrieve all cats from the DB and console.log each one
  Project.find({}, function(err, projects) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      req.projects = projects;
      next();
    }
  });
}

// function de vérification existence utilisateur utilisateur

function checkUser(req, res, next) {
  // retrieve all cats from the DB and console.log each one
  if (req.user.isActive && req.isAuthenticated()) {
    next();
  }
}

//function de récupération des actors du projet (find)

function getResources(id, callback) {
  // retrieve all cats from the DB and console.log each one
  Project.findById(id, function(err, resources) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      req.resources = resources;
      next();
    }
  });
}

function getProject(id, callback) {
  // retrieve all cats from the DB and console.log each one
  Project.findById(id, function(err, project) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback(project);
    }
  });
}

function getMyProjects(creator, callback) {
  // retrieve all cats from the DB and console.log each one

  console.log(creator);
  Project.find({
    creator: creator._id
  }, function(err, myProjects) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback(myProjects);
    }
  });
}

function updateAccount(user, callback) {
  User.update({
    _id: user._id
  }, {
    $set: {
      username: user.username,
      phone: user.phone,
      zipCode: user.zipCode,
      email: user.email,
    },
  }, function(err, user) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback(user);
    }
  });
}


// resources: [{ // les resources
//     contributor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User"
//     },
//     isActive: {
//       type: Boolean,
//       default: false
//     }
// }]


function updateProject(id, user, callback) {
  User.update({
    _id: id
  }, {
    $set: {

    },

  }, function(err, user) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback(user);
    }
  });
}

function deleteProject(id, callback) {
  console.log('remove');
  // retrieve all cats from the DB and console.log each one
  Project.remove({
    _id: id
  }, function(err, project) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback(project);
    }
  });
}

app.get('/', function(req, res) {
  var callback = function() {
    res.render('home', {
      isLogged: req.isAuthenticated(),
    });
  }
  callback();
});

app.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login', {
      isLogged: req.isAuthenticated()
    });
  }
});

app.get('/register', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

app.get('/account', function(req, res) {
  res.render('account', {
    isLogged: req.isAuthenticated(),
    user: req.user,
  });
});

app.post('/account', function(req, res) {
  var callback = function(account) {
    res.render('account', {
      isLogged: req.isAuthenticated(),
      username: req.body.username,
      phone: req.body.phone,
      email: req.body.email,
      account: {
        zipCode: req.body.zipCode,
      },
    });
  }
  updateAccount(req.user, callback);
});


app.post('/register', function(req, res) {

  console.log('will register');
  //console.log(req.body);

  User.register(
    new User({
      phone: req.body.phone,
      email: req.body.email,
      username: req.body.username,
      account: {
        zipCode: req.body.zipCode,
      },
    }),
    req.body.password, // password will be hashed
    function(err, user) {
      if (err) {
        console.log(err);
        return res.send(false);
      } else {
        console.log("will authenticate");
        passport.authenticate('local')(req, res, function() {
          console.log("User:", req.user);
          res.send(true);
        });
      }
    }
  );

});

app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    if(req.user) {
      res.send(true);
    }
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    //res.redirect('/projects');
  });

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/publish', function(req, res) {
  res.render('publishProject', {
    isLogged: req.isAuthenticated()
  });
});

var fs = require('fs');
app.post('/publish', upload.array('photos', 12), photosToArray, function(req, res) {
  var project = new Project({
    category: req.body.category,
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    city: req.body.city,
    comments: req.body.comments,
    photos: req.photos,
    creator: req.user,
  });
  project.save(function(err, obj) {
    if (err) {
      console.log('something went wrong');
    } else {
      res.redirect('/');
      console.log('add new project' + obj.titre);
    }
  });

});

app.get('/project/:id', function(req, res) {
  var id = req.params.id;
  var callback = function(project) {
    console.log("project:", project);
    res.render('project', {
      isLogged: req.isAuthenticated(),
      project: project,
    });
  }
  getProject(id, callback);
});

// app.post('/project/:id', function(req, res) {
//   var id = req.params.id;
//   var callback = function(project) {
//     res.render('project', {
//       isLogged: req.isAuthenticated(),
//       project: project,
//     });
//   }
//   getProject(id, callback);
// });


app.post('/project/:id/join', checkUser, getResources, function(req, res) {
  var id = req.params.id;
  console.log(req.resources);
});


app.get('/myprojects', function(req, res) {
  var callback = function(myProjects) {
    res.render('myprojects', {
      isLogged: req.isAuthenticated(),
      user: req.user,
      myProjects: myProjects
    });
  }
  getMyProjects(req.user, callback);
});

var fs = require('fs');
// penser à supprimer les images associés dans le répertoire "uplaod"
app.post('/mes-Projects/:id/delete', function(req, res) {
  //get the temporary location of the file
  //récupérer les id
  //faire un middleware avec next et boucler sur les photos
  // var tmp_path = .photos.path;
  // //delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
  // fs.unlink(tmp_path, function() {
  //   if (err) throw err;
  //   console.log('File deleted on : ' + tmp_path + ' - ' + req.files);
  // });
  var id = req.params.id;
  var callback = function(project) {
    console.log("project:", project);
    res.redirect('/myprojects');
  }
  deleteProject(id, callback);
});

app.get('/projects', getProjects, function(req, res) {
    res.render('projects', {
      isLogged: req.isAuthenticated(),
      projects: req.projects,
    });
});

// app.get('/project', function(req, res) {
//   res.render('project');
// });

app.get('/welcome', function(req, res) {
  res.render('welcome');
});

app.get('/about', function(req, res) {
  res.render('about');
});

app.get('/skills', function(req, res) {
  res.render('skills');
});

app.get('/editProfile', function(req, res) {
  res.render('editProfile');
});

app.post('/editProfile', function(req, res) {
  res.render('editProfile');
});

app.get('/editProject', function(req, res) {
  res.render('editProject');
});

app.post('/editProject', function(req, res) {
  res.render('editProject');
});

app.get('/secret', function(req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render('secret');
  } else {
    res.redirect('/');
  }
});

app.get('/account', function(req, res) {
  res.render('account', {
    isLogged: req.isAuthenticated(),
    user: req.user,
  });
});

app.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(3000, function() {
  console.log('server is listening');
});
