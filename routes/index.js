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
    res.render('caption', {name: 'Guest User', authStatus: false });
});


module.exports = router;
