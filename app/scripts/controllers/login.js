angular.module('letItDropApp').controller('LoginCtrl', ['$scope', '$http', '$cookies', function ($scope, $http, $cookies) {
  var _this = this;

  /**
   * try to log in with key
   */
  $scope.ok = function () {
    var login = $scope.login;

    if (login) {
      $http.get('api/login', {
        params: {
          key: login.key
        }
      }).then(function () {
        $cookies.put('key', login.key);
        $scope.$close();
      }).catch(function () {
        alert('Wrong key!');
      });
    }
  }
}]);
