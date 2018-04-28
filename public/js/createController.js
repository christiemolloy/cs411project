angular.module('myApp.create', ['ngRoute', 'ngCookies'])
    .controller('createCtrl', [function($scope, $http, $cookies, $location) {

        $scope.urlinfo = "this is the url";
        $scope.SubmitImage = function () {
            console.log("clicked button");
            $scope.url = input;
        };

    }])

    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider
                .when('/', {
                    templateUrl: '../views/create',
                    controller: 'createController'
                })
    }]);
