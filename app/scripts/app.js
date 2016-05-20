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
  .run([
    '$rootScope',
    '$location',
    'LoginService',
    function ($rootScope, $location, login) {
      var path = function () {
        return $location.path();
      };
      $rootScope.$watch(path, function (newVal, oldVal) {

        // run login service to check the login status
        login.checkDropZoneStatus();

        // expose the current location to set the current tab to active in navigation
        $rootScope.activetab = newVal;
      });
    }]);
