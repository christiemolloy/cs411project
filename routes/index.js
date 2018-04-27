var express = require('express');
var router = express.Router();

//Get the api key
let Clarifai_api_key = require('../config/clarifai').CONSUMER_KEY;
let Genius_api_key = require('../config/genius').CLIENT_ACCESS_TOKEN;

const Clarifai = require("clarifai");
const Clarifai_app = new Clarifai.App({
    apiKey: Clarifai_api_key
});

const Genius = require('genius-api');
const Genius_app = new Genius(Genius_api_key);

const Lyrics = require('lyric-get');



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
    //console.log(req.body);
    console.log(req.body.words);

    Genius_app.search(req.body.words).then(
        function(response) {
            console.log(response.hits);
            var title = response.hits[0].result.title;
            var artist = response.hits[0].result.full_title.split("by")[1];
            console.log("title is: ", title);
            console.log("artist is: ", artist);
                Lyrics.get(artist, title, function(err, results) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(res);
                        res.render('lyrics', {title: 'lyrics', result: results});
                    }
                });

        },
        function(err) {
            console.error(err);
        }
    );

});







module.exports = router;
