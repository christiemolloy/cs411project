var express = require('express');
var router = express.Router();

//Get the configuration for twitter
let twitterConfig = require('../config/twitter');

//Connect to user database
var User = require('../models/User')
var passport = require('passport')
var TwitterStrategy = require('passport-twitter').Strategy

var passportOptions = {
    consumerKey: twitterConfig.CONSUMER_KEY,
    consumerSecret: twitterConfig.CONSUMER_SECRET,
    callbackURL: twitterConfig.CALLBACK_URL
}

passport.use(new TwitterStrategy(passportOptions,
    function(token, tokenSecret, profile, done){
        User.findOneAndUpdate({twitterID: profile.id},
            {
                twitterID: profile.id,
                name: profile.displayName,
                username: profile.username
            },
            {'upsert': 'true'},
            function(err, result){
                if(err){
                    console.log(err)
                    return done(err, null)
                }
                else{
                    return done(null, profile)
                }
            })
    })
)

console.log("Got Here")

passport.serializeUser(function (user, done){
    console.log('in serialize, setting id on session:', user.id)
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    console.log('in deserialize with id', id)
    User.findOne({twitterID: id}, function (err, user) {
        done(err, user)
    })
})

router.get('/', function (req, res, next) {

})


router.get('/success', function (req, res, next) {
    res.redirect('/')
})


router.get('/logout', function (req, res, next) {
    User.findOne({twitterID: req.user.twitterID})
        .then(function (err, response) {
            req.logOut()
            res.clearCookie()
            res.status = 401
            res.redirect('/')
        })
})

//OAuth Step 1
router.get('/twitter',
    passport.authenticate('twitter'))

//OAuth Step 2
router.get('/callback',
    passport.authenticate('twitter',
        {failureRedirect: '/login',}),
    function (req, res) {
        res.cookie('userId', res.req.user.id)
        res.cookie('userName', res.req.user.displayName)
        res.cookie('authStatus', 'true')
        res.render('caption', {name: res.req.user.displayName});
    })


module.exports = router;
