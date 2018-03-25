var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CapThat' });
});

/* GET image page. */
router.get('/image', function(req, res, next) {
    res.render('image', { title: 'Upload image' });
});


module.exports = router;
