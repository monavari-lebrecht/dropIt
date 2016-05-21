angular.module('letItDropApp').controller('LoginCtrl', ['$scope', '$http', '$cookies', 'LoginService', function ($scope, $http, $cookies, loginService) {
  var _this = this;

  $scope.dropZoneKey = '';
  $scope.wrongKey = false;

  /**
   * function to create a new dropzone
   */
  $scope.create = function () {
    $http.get('api/dropZone/create').then(function (response) {
      $cookies.put('dropZoneKey', response.data.key);
      loginService.closeModal();
    });
  };

  /**
   * check whether the key exists and perform login process, if so... (cookie, closing modal...)
   */
  $scope.login = function () {
    $http.get('api/dropZone/' + $scope.dropZoneKey + '/exists').then(function () {
      $cookies.put('dropZoneKey', $scope.dropZoneKey);
      $scope.wrongKey = false;
      loginService.closeModal();
    }).catch(function () {
      // show hint about the wrong key
      $scope.wrongKey = true;
      $cookies.remove('dropZoneKey');
    });
  }
}]);
