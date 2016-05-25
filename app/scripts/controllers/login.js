angular.module('letItDropApp').controller('LoginCtrl', ['$scope', '$http', 'LoginService', function ($scope, $http, loginService) {
  var _this = this;

  $scope.dropZoneKey = '';
  $scope.wrongKey = false;

  /**
   * function to create a new dropzone
   */
  $scope.create = function () {
    $http.get('api/dropZone/create').then(function (response) {
      loginService.setDropZoneKey(response.data.key);
      loginService.closeModal();
    });
  };

  /**
   * check whether the key exists and perform login process, if so...
   */
  $scope.login = function () {
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
}]);
