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

    $scope.wrongKey = false;

    /**
     * function to create a new dropzone
     */
    $scope.create = function () {
      $http.get('api/dropZone/create').then(function (response) {
        loginService.setDropZoneKey(response.data.key);
      });
    };

    /**
     * check whether the key exists and perform openDropZone process, if so...
     */
    $scope.openDropZone = function () {
      if($scope.dropZoneKey) {
        $http.get('api/dropZone/' + $scope.dropZoneKey + '/exists').then(function () {
          loginService.setDropZoneKey($scope.dropZoneKey);
          $scope.wrongKey = false;
          loginService.closeModal();
        }).catch(function () {
          // show hint about the wrong key
          loginService.setDropZoneKey(undefined);
          $scope.wrongKey = true;
        });
      }
    }
  }]);
