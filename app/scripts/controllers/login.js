angular.module('letItDropApp').controller('LoginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
  var _this = this;

  /**
   * function to create a new dropzone
   */
  $scope.create = function () {
    $http.get('api/dropZone/create').then(function (response) {
      $cookies.put('dropZoneKey', response.data.key);
    });
  };

  $scope.login = function () {
    $http.get('api/dropZone/' + $scope.dropZoneKey + '/isValid').then(function () {
      $cookies.put('dropZoneKey', $scope.dropZoneKey);
    }).catch(function () {
      $cookies.remove('dropZoneKey');
    });
  }
}]);
