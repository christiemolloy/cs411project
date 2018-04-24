var express = require('express');
var router = express.Router();

//Get the api key
let Clarifai_api_key = require('../config/clarifai').CONSUMER_KEY;
let Genius_api_key = require('../config/genius').CLIENT_ACCESS_TOKEN;

const Clarifai = require("clarifai");
const Clarifai_app = new Clarifai.App({
    apiKey: Clarifai_api_key
});

var Genius = require('genius-api');
var Genius_app = new Genius(Genius_api_key);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CapThat' });
});


/* GET image page. */
router.get('/image', function(req, res, next) {
    res.render('image', { title: 'Upload image' });
});


/* GET lyrics page. */
router.get('/lyrics', function(req, res, next) {
    res.render('lyrics', { title: 'Search lyrics' });
});

router.post('/image', function(req, res, next) {
    console.log(req.body);

    // sample clarifai image : https://samples.clarifai.com/metro-north.jpg

    // predict the contents of an image by passing in a url
    Clarifai_app.models.predict(Clarifai.GENERAL_MODEL, req.body.imageurl).then(
        function(response) {
            console.log(JSON.stringify(response));
            res.render('image', { title:'recognition result', result: JSON.parse(JSON.stringify(response))});
        },
        function(err) {
            console.error(err);
        }
    );
});


router.post('/lyrics', function(req, res, next) {
    console.log(req.body);
    console.log(req.body.words);


    // Genius_app.song().then(
    //     function(response) {
    //         console.log("*******");
    //         console.log(response);
    //     },
    //     function(err) {
    //         console.error(err);
    //     }
    // );

    Genius_app.search(req.body.words).then(
        function(response) {
            console.log(response.hits);

            res.render('lyrics', {title: 'song search results', result: response.hits});
            //res.redirect??
        },
        function(err) {
            console.error(err);
        }
    )
});






module.exports = router;
