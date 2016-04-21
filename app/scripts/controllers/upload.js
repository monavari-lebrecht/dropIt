'use strict';

/**
 * @ngdoc function
 * @name letItDropApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the letItDropApp
 */
angular.module('letItDropApp')
  .controller('UploadCtrl', ['$scope', '$http', function ($scope, $http) {
    $http.get('api/list').then(function (res) {
      $scope.uploadedFiles = res.data;
    })
  }]);
