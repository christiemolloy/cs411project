var express = require('express');
var router = express.Router();
var request = require('request');

exports.index = function(req, res){
res.render('index', { title: 'ejs' });};

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


//database
const wordLyrics = require('../models/word_lyrics');




    /* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CapThat' });
});


/* GET create page. */
router.get('/create', function(req, res, next) {
    res.render('create', {title: 'Create' });
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


//get the lyrics for the input word
router.post('/lyrics', function(req, res, next) {
    console.log(req.body.words);
    // console.log(req.body.words.split(','));
    // console.log(req.body.words.split(',')[0]);
    // console.log(req.body.words.split(',')[1]);
    // console.log(req.body.words.split(',')[2]);

    Genius_app.search(req.body.words).then(
        function(response) {
            console.log(response.hits);
            var word = req.body.words;
            console.log(word);
            var title = response.hits[0].result.title;
            var artist = response.hits[0].result.full_title.split("by")[1];
            console.log("title is: ", title);
            console.log("artist is: ", artist);

            wordLyrics.count({word: word},function(err, result){
                console.log("The number of matching entry found is ");
                console.log(result);
                if(result != 0){
                    wordLyrics.findOne({word: word}, function(err, result){
                        res.render('lyrics', {title: 'lyrics', result: result['lyrics']});
                    })


                }
                else{
                    Lyrics.get(artist, title, function(err, results) {
                        if(err) {
                            console.log(err);
                        }
                        else {
                            console.log("Called the lyrics API");
                            //console.log(res);
                            var parsed_result = results.split('\n');
                            wordLyrics.create({word: String(word), lyrics: parsed_result});
                            res.render('lyrics', {title: 'lyrics', result: parsed_result});
                        }
                    })
                }
            })


        },
        function(err) {
            console.error(err);
        }
    )
});

<!--Razor api-->
router.post('/razor', function(req,res,next){
  console.log("made it to razor")
  var headers = {
      'x-textrazor-key': '029b5c96ab859efba5f7cef25654cf11c4f765b17fc71aeb618f9b78'
  };

  var dataString = 'extractors=phrases,words&text='+req.body.textblock;

  var options = {
      url: 'https://api.textrazor.com/',
      method: 'POST',
      headers: headers,
      body: dataString
  };
  console.log(req.body);

  function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
          var jsonObj = JSON.parse(response.body);
          var numberRan1 = Math.floor(Math.random() * 10);
          var numberRan2 = Math.floor(Math.random() * 10);
          var numberRan3 = Math.floor(Math.random() * 10);
          var numberRan4 = Math.floor(Math.random() * 10);
          var token1 = String(jsonObj.response.sentences[0].words[numberRan1].token);
          var token2 = String(jsonObj.response.sentences[0].words[numberRan2].token);
          var token3 = String(jsonObj.response.sentences[0].words[numberRan3].token);
          var token4 = String(jsonObj.response.sentences[0].words[numberRan4].token);
          // var token3 = jsonObj.response.sentences[0].words[numberRan].token;
          // var token4 = jsonObj.response.sentences[0].words[numberRan].token;
          // if (token1 !== ',') {
          //   var word1 = token1;
          // }
          // else {
          //
          // };

          // if (mpartOfSpeech == 'NN' || mpartOfSpeech == 'NNS' || mpartOfSpeech == 'NNP') {
          //   console.log(hi);
          // };
          res.render('razor', {result1: token1, result2: token2, result3: token3, result4: token4});
      }
  }

  var body;

  request(options, callback);


});



module.exports = router;
