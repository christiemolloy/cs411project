angular.module('myApp', ['ngRoute', 'ngCookies'])
    .controller('myCtrl', function($scope, $http, $cookies) {


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
    }

    });

    // .config(['$routeProvider',
    //     function ($routeProvider) {
    //         $routeProvider
    //             .when('/:status', {
    //                 templateUrl: '',
    //                 controller: 'authController'
    //             })
    //             .when(':status', {
    //                 templateUrl: '',
    //                 controller: 'authController'
    //             })
    //             .otherwise({
    //                 redirectTo: '/'
    //             })
    //     }]);

