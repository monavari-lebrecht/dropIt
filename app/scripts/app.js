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
  .run(['$rootScope', '$location', '$uibModal', '$cookies', '$http', function ($rootScope, $location, $modal, $cookies, $http) {

    var path = function () {
      return $location.path();
    };
    $rootScope.$watch(path, function (newVal, oldVal) {
      /**
       * opens a login dialog with corresponding controller
       */
      function openLoginDialog() {
        $modal.open({
          templateUrl : 'views/login.html',
          controller  : 'LoginCtrl',
          controllerAs: 'ctrl',
          keyboard    : false,
          backdrop    : 'static'
        });
      }

      // check if a valid key is given...
      var key = $cookies.get('dropZoneKey');
      if (!key) {
        openLoginDialog();
      }

      // expose the current location to set the current tab to active in navigation
      $rootScope.activetab = newVal;
    });
  }]);
