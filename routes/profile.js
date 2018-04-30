var express = require('express');
var router = express.Router();

var request = require('request');


var User = require('../models/User')

console.log("called profile.js")

/* GET profile page. */
router.get('/:caption/:user/:imageurl', function(req, res, next){
    console.log("entered the profile function")
    let cap = decodeURIComponent(req.params.caption);
    let userid = req.params.user;
    let url = decodeURIComponent(req.params.imageurl);
    console.log(cap);
    console.log(userid);
    console.log(url);
    User.findOneAndUpdate({twitterID: userid},
        {
            $addToSet: {
                uploads: {photo: url, caption: cap}
            }
        },
        function(err, result){
            if(err){
                console.log(err)
            }
            else{
            }
        })
    res.json(userid)

})



module.exports = router;