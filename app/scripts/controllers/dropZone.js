'use strict';

/**
 * @ngdoc function
 * @name letItDropApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the letItDropApp
 */
angular.module('letItDropApp')
  .controller('DropZoneCtrl', ['$scope', '$http', 'LoginService', '$rootScope', '$stateParams', '$state', function ($scope, $http, loginService, $rootScope, $stateParams, $state) {

    function goToDropZone() {
      var dropZoneKey = $stateParams.dropZoneId;

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
      $http.post('api/dropZone/create').then(function (response) {

      }).catch(function () {
        // open login modal
        loginService.login();
      });
    };

    /**
     * check whether the key exists and perform openDropZone process, if so...
     */
    $scope.openDropZone = function () {
      if($scope.dropZoneKey) {
        $http.get('api/dropZone/' + $scope.dropZoneKey + '/exists').then(function () {
          $state.go('dropZone.show', {dropZoneId: $scope.dropZoneKey});
        }).catch(function () {
          // TODO: show some failure message
        });
      }
    }
  }]);
