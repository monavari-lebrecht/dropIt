'use strict';

/**
 * @ngdoc function
 * @name letItDropApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the letItDropApp
 */
angular.module('letItDropApp')
  .controller('DropZoneCtrl', ['$scope', '$http', 'LoginService', '$rootScope', function ($scope, $http, loginService, $rootScope) {

    function goToDropZone() {
      var dropZoneKey = loginService.getDropZoneKey();

      // run openDropZone service to check the openDropZone status
      loginService.openDropZone();

      if (dropZoneKey) {
        $scope.dropZoneConfig = {
          'parallelUploads': 3,
          'maxFileSize'    : 30,
          'url'            : '/api/dropZone/' + dropZoneKey + '/upload'
        };

        $http.get('api/dropZone/' + dropZoneKey).then(function (res) {
          $scope.dropZone = res.data;
        });
      }
    }

    $rootScope.$on('$stateChangeSuccess', function () {
      goToDropZone();
    });
    // go to dropZone
    goToDropZone();
  }]);
