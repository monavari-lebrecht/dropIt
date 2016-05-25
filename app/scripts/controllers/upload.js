'use strict';

/**
 * @ngdoc function
 * @name letItDropApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the letItDropApp
 */
angular.module('letItDropApp')
  .controller('UploadCtrl', ['$scope', '$http', 'LoginService', function ($scope, $http, loginService) {
    var dropZoneKey = loginService.get('dropZoneKey');

    $scope.dropZoneConfig = {
      'parallelUploads': 3,
      'maxFileSize'    : 30,
      'url'            : '/api/dropZone/' + dropZoneKey + '/upload'
    };

    $http.get('api/dropZone/' + dropZoneKey).then(function (res) {
      $scope.dropZone = res.data;
    })
  }]);
