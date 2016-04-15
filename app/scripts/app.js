'use strict';

/**
 * @ngdoc overview
 * @name letItDropApp
 * @description
 * # letItDropApp
 *
 * Main module of the application.
 */
angular
  .module('letItDropApp', [
    'ngAnimate',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDropzone'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl : 'views/upload.html',
        controller  : 'UploadCtrl',
        controllerAs: 'ctrl'
      })
      .when('/contact', {
        templateUrl : 'views/contact.html',
        controller  : 'ContactCtrl',
        controllerAs: 'ctrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  // expose the current location to set the current tab to active in navigation
  .run(['$rootScope', '$location', function ($rootScope, $location) {
    var path = function () {
      return $location.path();
    };
    $rootScope.$watch(path, function (newVal, oldVal) {
      $rootScope.activetab = newVal;
  });
  }]);
