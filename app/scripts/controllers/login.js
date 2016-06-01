angular.module('letItDropApp').controller('LoginCtrl', ['$http', '$scope', '$cookies', function ($http, $scope, $cookies) {

  $scope.login = function () {
    $http.post('/api/user/requestAuthToken', {
      username: $scope.username,
      password: $scope.password
    }).then(function (response) {
      // store token for later usage
      $cookies.put('token', response.data.token);
      // close the login modal
      $scope.$close();
    });
  };

}]);
