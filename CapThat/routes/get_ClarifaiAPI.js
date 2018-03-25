
const Clarifai = require("clarifai");
const app = new Clarifai.App({
 apiKey: 'fe2b42b4d83e4f01ababb8c56ccdd08d'
});

// predict the contents of an image by passing in a url
app.models.predict(Clarifai.GENERAL_MODEL, 'https://samples.clarifai.com/metro-north.jpg').then(
  function(response) {
    console.log(response);
  },
  function(err) {
    console.error(err);
  }
);