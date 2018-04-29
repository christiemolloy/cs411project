var express = require('express');
var router = express.Router();

var request = require('request');

//Get the api key
let Clarifai_api_key = require('../config/clarifai').CONSUMER_KEY;

const Clarifai = require("clarifai");
const Clarifai_app = new Clarifai.App({
    apiKey: Clarifai_api_key
});
console.log("Called the caption.js")

router.get('/clarifai/:name', function(req, res, next) {

    // sample clarifai image : https://samples.clarifai.com/metro-north.jpg

    // predict the contents of an image by passing in a url
    let searchkey = req.params.name;
    console.log("*****");
    console.log(req.params.name);
    console.log(searchkey);
    Clarifai_app.models.predict(Clarifai.GENERAL_MODEL, searchkey).then(
        function(response) {
            console.log(JSON.stringify(response));
            res.send(response.outputs[0].data.concepts);

            //res.render('image', { title:'recognition result', result: JSON.parse(JSON.stringify(response))});
        },
        function(err) {
            console.error(err);
        }
    );
});

let Genius_api_key = require('../config/genius').CLIENT_ACCESS_TOKEN;

const Genius = require('genius-api');
const Genius_app = new Genius(Genius_api_key);

const Lyrics = require('lyric-get');


//database
const wordLyrics = require('../models/word_lyrics');


//get the lyrics for the input word
router.get('/genius/:name', function(req, res, next) {


    let searchkey = req.params.name;
    console.log(searchkey);

    Genius_app.search(searchkey).then(
        function(response) {
            console.log(response.hits);
            var word = searchkey;
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
                        res.json(result['lyrics']);
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
                            res.json(parsed_result);
                            //res.render('lyrics', {title: 'lyrics', result: parsed_result});
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

let TextRazor_api_key = require('../config/razor').headers;

<!--Razor api-->
router.get('/lyrics/:name', function(req,res,next){
    console.log(req.body.textblock);

    let searchkey = req.params.name;
    console.log("******");
    console.log(searchkey);
    console.log("******");

    console.log("made it to razor")

    var dataString = 'extractors=phrases,words&text='+searchkey;

    var options = {
        url: 'https://api.textrazor.com/',
        method: 'POST',
        headers: TextRazor_api_key,
        body: dataString
    };


    function callback(error, response, body) {
        console.log("callback called");
        if (!error && response.statusCode == 200) {
            console.log("text razor working...");
            var jsonObj = JSON.parse(response.body);
            var numberRan1 = Math.floor(Math.random() * 30);
            var numberRan2 = Math.floor(Math.random() * 30);
            var numberRan3 = Math.floor(Math.random() * 30);
            var numberRan4 = Math.floor(Math.random() * 30);
            var token1 = String(jsonObj.response.sentences[0].words[numberRan1].partOfSpeech);
            var token2 = String(jsonObj.response.sentences[0].words[numberRan2].partOfSpeech);
            var token3 = String(jsonObj.response.sentences[0].words[numberRan3].partOfSpeech);
            var token4 = String(jsonObj.response.sentences[0].words[numberRan4].partOfSpeech);

            <!-- Finding Noun 1 -->
            for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
              if(jsonObj.response.sentences[0].words[i].partOfSpeech === "NN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "NNS") {
                token1 = jsonObj.response.sentences[0].words[i].token;
              }
              else {
                i++;
              }
            }

            <!-- Finding Noun2-->
            for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
              console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
              if(jsonObj.response.sentences[0].words[i].partOfSpeech === "NN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "NNS") {
                if(jsonObj.response.sentences[0].words[i].token != token1) {
                  token2 = jsonObj.response.sentences[0].words[i].token;
                };
              }
              else {
                i++;

              }
            }

            <!-- Finding Noun3-->
            for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
              console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
              if(jsonObj.response.sentences[0].words[i].partOfSpeech === "NN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "NNS") {
                if(jsonObj.response.sentences[0].words[i].token != token1 && jsonObj.response.sentences[0].words[i].token != token2) {
                  token3 = jsonObj.response.sentences[0].words[i].token;
                };
              }
              else {
                i++;
              }
            }

            <!-- Finding Noun4-->
            for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
              console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
              if(jsonObj.response.sentences[0].words[i].partOfSpeech === "NN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "NNS") {
                if(jsonObj.response.sentences[0].words[i].token != token1 && jsonObj.response.sentences[0].words[i].token != token2 && jsonObj.response.sentences[0].words[i].token != token3) {
                  token4 = jsonObj.response.sentences[0].words[i].token;
                };
              }
              else {
                i++;
              }
            }



            <!-- Finding Verb1 -->
            for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
              console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
              if(jsonObj.response.sentences[0].words[i].partOfSpeech === "VB" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBD" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBG" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBZ") {
                token5 = jsonObj.response.sentences[0].words[i].token;
              }
              else {
                i++;
              }
            }


            <!-- Finding Verb2 -->
            for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
              console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
              if(jsonObj.response.sentences[0].words[i].partOfSpeech === "VB" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBD" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBG" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBZ") {
                if(jsonObj.response.sentences[0].words[i].token != token5) {
                  token6 = jsonObj.response.sentences[0].words[i].token;
              }
              else {
                i++;
              }
            }
          }

          <!-- Finding Verb3 -->
          for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
            console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
            if(jsonObj.response.sentences[0].words[i].partOfSpeech === "VB" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBD" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBG" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBZ") {
              if(jsonObj.response.sentences[0].words[i].token != token5 && jsonObj.response.sentences[0].words[i].token != token6) {
                token7 = jsonObj.response.sentences[0].words[i].token;
            }
            else {
              i++;
            }
          }
        }

        <!-- Finding Verb3 -->
        for (i=0; i < jsonObj.response.sentences[0].words.length; i++) {
          console.log("hi" + jsonObj.response.sentences[0].words[i].partOfSpeech);
          if(jsonObj.response.sentences[0].words[i].partOfSpeech === "VB" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBD" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBG" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBN" || jsonObj.response.sentences[0].words[i].partOfSpeech === "VBZ") {
            if(jsonObj.response.sentences[0].words[i].token != token5 && jsonObj.response.sentences[0].words[i].token != token6 && jsonObj.response.sentences[0].words[i].token != token7) {
              token8 = jsonObj.response.sentences[0].words[i].token;
          }
          else {
            i++;
          }
        }
      }

            res.json([token1, token2, token3, token4, token5, token6, token7, token8]);
            console.log(token1, token2, token3, token4, token5, token6, token7, token8);
        }
    }

    var body;

    request(options, callback);


});



module.exports = router;
