angular.module('myApp', ['ngRoute', 'ngCookies'])
    .controller('myCtrl', function($scope, $http, $cookies, $location, $window) {

        $scope.imageSearched = false;

        $scope.SubmitImage = function(input) {
            $scope.saveButton = "Save this caption"
            $scope.imageLink = input;
            console.log("calling clarifai api");
            let userid = $cookies.get('userId')
            $http.get('http://localhost:3000/caption/clarifai/' + userid + '/' + encodeURIComponent(input))
                .then(function(response) {
                    console.log(response);
                    console.log("clarifai api called");
                    $scope.imageSearched = true;
                    $scope.userid = userid;
                    $scope.imageurl = $scope.imageLink;
                    $scope.firstWord = response.data[0].name;
                    $scope.secondWord = response.data[1].name;
                    $scope.thirdWord = response.data[2].name;
                    $scope.fourthWord = response.data[3].name;
                    $scope.fifthWord = response.data[4].name;
                });
        };


        $scope.captionFound = false;
        $scope.wordNotFound = false;

        $scope.findLyrics = function(input) {
            console.log("calling genius api");
            $http.get('http://localhost:3000/caption/genius/' + input)
                .then(function(response) {
                    console.log(response);

                    if(response.data == "error") {
                        $scope.captionFound = false;
                        $scope.wordNotFound = true;
                        $scope.lyrics = "";
                        console.log("word is not found");
                        // insert pop up
                    }
                    else {
                        $scope.wordNotFound = false;
                        $scope.lyrics = response.data;
                        console.log("word was found");
                    }

                    console.log("genius api called");

                })

                .then(function() {
                    console.log("calling text razor");
                    $http.get('http://localhost:3000/caption/lyrics/' + $scope.lyrics)
                        .then(function(response) {
                            $scope.captionFound = true;
                            $scope.caption = response.data;
                            $scope.i = 0;
                            $scope.cap = $scope.caption[$scope.i];
                            console.log($scope.cap);
                        })
                })
        };

        $scope.changeCaption = function() {
            $scope.saveButton = "Save this caption"
            $scope.i += 1;
            $scope.cap = $scope.caption[$scope.i];
            console.log($scope.i);
            console.log($scope.caption[$scope.i]);

            if ($scope.i == 8) {
                $scope.finishedCaptions = true;
            }
        };

        $scope.noMoreCaptions = function() {
            $scope.finishedCaptions = false;
            $scope.i = 0;
            $scope.cap = $scope.caption[$scope.i];
        };


        $scope.saveButton = "Save this caption";
        $scope.saveCaption = function(caption, image, user) {

            console.log("calling save caption");
            console.log("caption is");
            console.log(caption);

            $http.get('http://localhost:3000/profile/' + caption + '/' + user +  '/'+ encodeURIComponent(image))
                .then(function(response) {
                    // console.log(response);
                }, function (error) {
                    // not relevant
                })
            $scope.saveButton = "Caption saved.";
        };


        $scope.gotData = false;
        $scope.displayOldPhotos = false;

        $scope.showPastCaptions = function(input) {
            console.log(input)
            if(input == true) {
                $scope.displayOldPhotos = true;
                console.log("button clicked");
                $http.get('http://localhost:3000/profile/getdata/' + $scope.userid)
                    .then(function(response){
                        $scope.gotData = true;
                        $scope.user = response.data;
                        console.log($scope.user);
                        $scope.uploads = $scope.user.uploads;
                        console.log($scope.uploads);

                    })
            }
            else {
                console.log("you are not logged in");
            }

        };



        $scope.initApp = function ( ) {
            // $scope.buttonState = "create"
            // $scope.h2message = "Add user"
            // $scope.buttonMessage = "Add User"
            $scope.authorized = false;
            $scope.showLogin = false;
            // $scope.getUsers()
            //Grab cookies if present
            let authCookie = $cookies.get('authStatus');
            $scope.authorized = !!authCookie;
            // $scope.google_image_hide = true
            // $scope.twitter_hide = true
            // $scope.google_image_old = true
            // $scope.youtube_hide = true
        };

        $scope.logout = function () {
            $http.get('/auth/logout')
                .then(function (response) {
                    $scope.authorized = false;
                    window.location.replace('http://localhost:3000')
                })
        };

        $scope.login = function () {
            const request = {
                method: 'post',
                url: 'http://localhost:3000/auth/login',
                data: {
                    username: $scope.username,
                    password: $scope.password
                }
            };
            $http(request)
                .then(function (response) {
                        $scope.authorized = true;
                        $scope.showLogin = false
                    },
                    function (err) {
                        $scope.authorized = false
                    }
                )
        };

        $scope.showLoginForm = function () {
            $scope.showLogin = true
        };

        $scope.doTwitterAuth = function () {
            console.log("Called the doTwitterAuth function");
            var openUrl = '/auth/twitter/';
            //Total hack, this:
            $scope.authorized = true;
            window.location.replace(openUrl)
        };



    });


