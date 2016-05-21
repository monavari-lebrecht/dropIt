angular.module('letItDropApp').controller('LoginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
  var _this = this;

  $scope.dropZoneKey = '';
  $scope.wrongKey = false;

  /**
   * function to create a new dropzone
   */
  $scope.create = function () {
    $http.get('api/dropZone/create').then(function (response) {
      $cookies.put('dropZoneKey', response.data.key);
      $scope.$close();
    });
  };

  $scope.login = function () {
    $http.get('api/dropZone/' + $scope.dropZoneKey + '/exists').then(function () {
      $cookies.put('dropZoneKey', $scope.dropZoneKey);
      $scope.wrongKey = false;
      $scope.$close();
    }).catch(function () {
      // show hint about the wrong key
      $scope.wrongKey = true;
      $cookies.remove('dropZoneKey');
    });
  }
}]);
