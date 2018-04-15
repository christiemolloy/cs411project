var express = require('express');
var router = express.Router();

//Get the api key
let api_key = require('../config/clarifai').CONSUMER_KEY;

const Clarifai = require("clarifai");
const app = new Clarifai.App({
    apiKey: api_key
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CapThat' });
});



/* GET image page. */
router.get('/image', function(req, res, next) {
    res.render('image', { title: 'Upload image' });
});


router.post('/image', function(req, res, next) {
    console.log(req.body);

    // sample clarifai image : https://samples.clarifai.com/metro-north.jpg

    // predict the contents of an image by passing in a url
    app.models.predict(Clarifai.GENERAL_MODEL, req.body.imageurl).then(
        function(response) {
            console.log(JSON.stringify(response));
            res.render('image', { title:'recognition result', result: JSON.parse(JSON.stringify(response))});
        },
        function(err) {
            console.error(err);
        }
    );



});

module.exports = router;
