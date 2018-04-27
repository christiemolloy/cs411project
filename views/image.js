var express = require('express');
var router = express.Router();

const Clarifai = require("clarifai");
const app = new Clarifai.App({
 apiKey: 'fe2b42b4d83e4f01ababb8c56ccdd08d'
});




router.post('/image', function(req, res, next) {
    console.log(req.body);

    // sample clarifai image : https://samples.clarifai.com/metro-north.jpg

    // predict the contents of an image by passing in a url
    app.models.predict(Clarifai.GENERAL_MODEL, req.body.imageurl).then(
        function(response) {
            console.log(JSON.stringify(response));
        },
        function(err) {
            console.error(err);
        }
    );




    if (error) throw new Error(error);

    console.log(req);


    res.render('image', { result: JSON.parse(response) });

});



module.exports = router;
