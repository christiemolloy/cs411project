angular.module('myApp', ['ngRoute', 'ngCookies'])
    .controller('myCtrl', function($scope, $http, $cookies, $location) {

        $scope.imageSearched = false;

        $scope.SubmitImage = function(input) {
            console.log("calling clarifai api");
            let userid = $cookies.get('userId')
            $http.get('http://localhost:3000/caption/clarifai/' + userid + '/' + encodeURIComponent(input))
                .then(function(response) {
                    console.log(response);
                    console.log("clarifai api called");
                    $scope.imageSearched = true;
                    $scope.firstWord = response.data[0].name;
                    $scope.secondWord = response.data[1].name;
                    $scope.thirdWord = response.data[2].name;
                    $scope.fourthWord = response.data[3].name;
                    $scope.fifthWord = response.data[4].name;
                });
        };


        //$scope.lyricsFound = false;
        $scope.captionFound = false;

        $scope.findLyrics = function(input) {
            console.log("calling genius api");
            $http.get('http://localhost:3000/caption/genius/' + input)
                .then(function(response) {
                    console.log(response);
                    console.log("genius api called");
                    //$scope.lyricsFound = true;
                    $scope.lyrics = response.data;
                })
                .then(function() {
                    console.log("calling text razor");
                    $http.get('http://localhost:3000/caption/lyrics/' + $scope.lyrics)
                        .then(function(response) {
                            $scope.captionFound = true;
                            $scope.caption = response.data;
                            console.log($scope.caption);
                        })
                })
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

    // .config(['$routeProvider',
    //     function ($routeProvider) {
    //         $routeProvider
    //             .when('/', {
    //                 templateUrl: '../index',
    //                 controller: 'controllers'
    //             })
    //     }]);

