var express = require("express");
var router = express.Router();

router.get('/', function(req, res) {
  var callback = function() {
    res.render('home', {
      isLogged: req.isAuthenticated(),
    });
  }
  callback();
});

router.get('/welcome', function(req, res) {
  res.render('welcome');
});

router.get('/about', function(req, res) {
  res.render('about');
});


module.exports = router;
