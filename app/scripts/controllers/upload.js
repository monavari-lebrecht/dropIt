'use strict';

/**
 * @ngdoc function
 * @name letItDropApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the letItDropApp
 */
angular.module('letItDropApp')
  .controller('UploadCtrl', ['$scope', function ($scope) {

    /**
     * handles errors on uploading files with dropzone
     */
    this.dzError = function () {

    };

    /**
     * function is executed when a new file is dropped at dropzone
     */
    this.dzAddedFile = function () {
    };

    // assign reference to controller to view
    $scope.ctrl = this;
  }]);
