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
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'ngDropzone',
    'ui.bootstrap'
  ])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('dropZone', {
        url        : '/dropZone',
        templateUrl: 'views/dropZone.html',
        controller : 'DropZoneCtrl'
      })
      .state('dropZone.show', {
        url        : '/:dropZoneId',
        templateUrl: 'views/dropZone.show.html',
        controller : 'DropZoneCtrl'
      })
      .state('contact', {
        url        : '/contact',
        templateUrl: 'views/contact.html',
        controller : 'ContactCtrl'
      });

    $urlRouterProvider
      .otherwise('/dropZone');
  })
  .run([
    '$rootScope',
    '$location',
    function ($rootScope, $location) {
      var path = function () {
        return $location.path();
      };
      $rootScope.$watch(path, function (newVal, oldVal) {
        // expose the current location to set the current tab to active in navigation
        $rootScope.activetab = newVal;
      });
    }]);
