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
    'ngDropzone',
    'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dropZone', {
        templateUrl : 'views/upload.html',
        controller  : 'UploadCtrl',
        controllerAs: 'ctrl'
      })
      .when('/dropZone/:dropZoneId', {
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
        redirectTo: '/dropZone'
      });
  })
  .run([
    '$rootScope',
    '$location',
    'LoginService',
    function ($rootScope, $location, openDropZone) {
      var path = function () {
        return $location.path();
      };
      $rootScope.$watch(path, function (newVal, oldVal) {
        // expose the current location to set the current tab to active in navigation
        $rootScope.activetab = newVal;
      });
    }]);
