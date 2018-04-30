var express = require('express');
var router = express.Router();

var request = require('request');


console.log("called profile.js")
/* GET profile page. */
router.get('/', function(req, res, next) {
    res.render('profile', { title: 'profile' });
});

module.exports = router;