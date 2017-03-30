var express = require("express");
var router = express.Router();
var passport = require('passport');

var User = require('../models/User');


function updateAccount(user,formFields, callback) {
  console.log('formFields',formFields);
  User.update({
    _id: user._id
  }, {
    $set: {
      // username: formFields.username,
      phone: formFields.phone,
      // zipCode: formFields.zipCode,
      // email: formFields.email,
    },
  }, function(err, formFields) {
    if (err) {
      console.log('An error occurred');
      console.log(err);
    } else {
      callback(formFields);
    }
  });
}


router.get('/login', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('login', {
      isLogged: req.isAuthenticated()
    });
  }
});

router.get('/register', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/');
  } else {
    res.render('register');
  }
});

router.get('/account', function(req, res) {
  res.render('account', {
    isLogged: req.isAuthenticated(),
    user: req.user,
  });
});

/*
email: String,
phone: String,
username: String,
  account: {
    zipCode: String,
    description: String,

*/


router.post('/account', function(req, res) {
var userFormFields = {
  name: req.body.username,
  phone: req.body.phone,
  email: req.body.email,
};
console.log("username :", userFormFields.name );
  var callback = function(user) {
    res.render('account', {
      isLogged: req.isAuthenticated(),
      user: req.user,
    })

    // console.log("phone :", phone );
    // console.log("email :", email );
    // }

  // );
  }
  updateAccount(req.user,userFormFields, callback);
});


router.post('/register', function(req, res) {

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

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    if(req.user) {
      res.send(true);
    }
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    //res.redirect('/projects');
  });

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect('/');
});


router.get('/secret', function(req, res) {
  if (req.isAuthenticated()) {
    console.log(req.user);
    res.render('secret');
  } else {
    res.redirect('/');
  }
});

router.get('/account', function(req, res) {
  res.render('account', {
    isLogged: req.isAuthenticated(),
    user: req.user,
  });
});


// router.get('/skills', function(req, res) {
//   res.render('skills');
// });
//
// router.get('/editProfile', function(req, res) {
//   res.render('editProfile');
// });
//
// router.post('/editProfile', function(req, res) {
//   res.render('editProfile');
// });


module.exports = router;
