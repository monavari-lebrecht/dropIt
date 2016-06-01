angular.module('letItDropApp').controller('LoginCtrl', ['$http', '$scope', '$cookies', function ($http, $scope, $cookies) {
  $scope.login = function () {
    $http.get('/api/user/requestAuthToken').then(function (response) {
      $cookies.put('token', response.data.token);
    });
  }
}]);
