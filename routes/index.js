var express = require('express');
var router = express.Router();
var request = require('request');

exports.index = function(req, res){
res.render('index', { title: 'ejs' });};


    /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CapThat' });
});


/* GET caption page. */
router.get('/caption', function(req, res, next) {
    res.render('caption', {name: 'Guest User' });
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
    res.render('profile', {title: 'profile' });
});


/* GET twitter user profile page. */
router.get('/profileT', function(req, res, next) {
    res.render('profileT', { title: 'ProfileT' });
});


/* GET image page. */
router.get('/image', function(req, res, next) {
    res.render('image', { title: 'Upload image' });
});


/* GET lyrics page. */
router.get('/lyrics', function(req, res, next) {
    res.render('lyrics', { title: 'Search lyrics' });
});



module.exports = router;
