var express = require("express");
var router = express.Router();
var multer = require('multer');
var upload = multer({
  dest: 'public/uploads/'
});

var Project = require('../models/Project');

var _ = require('lodash');

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


//function de récupération des actors du projet (find)

function getResources(req, res, next) {

  Project.findById(req.params.id, function(err, project) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      console.log(project.resources);
      req.resources = project.resources;
      next();
    }
  });
}


function getProject(id, callback) {
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


function updateProject(id, obj, callback) {
  console.log(id, obj);
  Project.update({
    _id: id
  }, {
    $set: obj,
  }, function(err, response) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      //console.log("update", response);
      callback(true);
    }
  });
}

// JOIN PROJECT
function joinProject(id, obj, callback) {
  console.log(id, obj);
  Project.update({
    _id: id
  }, {
    $set: obj,
  }, function(err, response) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback('LEAVE');
    }
  });
}

// LEAVE PROJECT
function leaveProject(id, obj, callback) {
  console.log(id, obj);
  Project.update({
    _id: id
  }, {
    $set: obj,
  }, function(err, response) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback('JOIN');
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


// function de vérification existence utilisateur utilisateur

function checkUser(req, res, next) {
  if (req.user.isActive && req.isAuthenticated()) {
    console.log("checkUser: OK");
    next();
  }
}

function checkUserRole(req, res, next) {

    var callback = (project) => {
      if (project.creator.toString() === req.user._id.toString()) {
        console.log("checkUserRole: OK");
        next();
      } else {
        console.log("checkUserRole: KO");
        console.log(project.creator, req.user._id);
      }
    }
    getProject(req.params.id, callback);
}

router.get('/publish', function(req, res) {
  res.render('projectCreate', {
    isLogged: req.isAuthenticated()
  });
});

router.post('/publish', upload.array('photos', 12), photosToArray, function(req, res) {
  var project = new Project({
    category: req.body.category,
    type: req.body.type,
    title: req.body.title,
    description: req.body.description,
    city: req.body.city,
    comments: req.body.comments,
    photos: req.photos,
    contributorMax: req.body.contributorMax,
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

// router.get('/project/:id', function(req, res) {
//   var id = req.params.id;
//   var callback = function(project) {
//     //console.log("project:", project);
//     res.render('project', {
//       isLogged: req.isAuthenticated(),
//       user: req.user,
//       project: project,
//     });
//   }
//   getProject(id, callback);
// });

router.get('/project/:id', function(req, res) {
  var id = req.params.id;
  var callback = function(project) {
    //console.log("project:", project);
    res.render('project', {
      isLogged: req.isAuthenticated(),
      user: req.user,
      project: project,
    })
  }
  getProject(id, callback);
});

router.post('/project/:id/join', checkUser, getResources, function(req, res) {
  console.log(req.resources);
  var id = req.params.id;
  var callback = (button) => {
    res.send(button);
  }
  if(!_.find(req.resources, {contributor: req.user._id})) {
    console.log("Le contributeur n'est PAS associé au projet");
    req.resources.push({contributor: req.user._id});
    var obj = req.resources;
    console.log(obj);
    joinProject(id, {resources: obj}, callback);
  } else {
    req.resources = _.reject(req.resources, {contributor: req.user._id});
    var obj = req.resources;
    leaveProject(id, {resources: obj}, callback);
  }
});

router.get('/project/:id/edit', checkUser, checkUserRole, function(req, res) {
  var id = req.params.id;
  var callback = (project) => {
    res.render('projectEdit',
      {
        isLogged: req.isAuthenticated(),
        user: req.user,
        project: project
      }
    )
  }
  getProject(id, callback);
});

router.get('/myprojects', function(req, res) {
  var callback = function(myProjects) {
    res.render('myprojects', {
      isLogged: req.isAuthenticated(),
      user: req.user,
      myProjects: myProjects
    });
  }
  getMyProjects(req.user, callback);
});


// penser à supprimer les images associés dans le répertoire "uplaod"
router.post('/mes-Projects/:id/delete', function(req, res) {
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

router.get('/projects', getProjects, function(req, res) {
    res.render('projects', {
      isLogged: req.isAuthenticated(),
      projects: req.projects,
    });
});


//
// router.get('/editProject', function(req, res) {
//   res.render('editProject');
// });
//
// router.post('/editProject', function(req, res) {
//   res.render('editProject');
// });



module.exports = router;
