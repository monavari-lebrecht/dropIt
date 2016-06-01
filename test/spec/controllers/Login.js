describe('Controller: LoginCtrl', function () {
  var $httpBackend;
  var $cookies;
  var createController;
  var $controller;
  var $scope;

  beforeEach(module('letItDropApp'));

  beforeEach(inject(function ($injector) {
    $controller = $injector.get('$controller');

    $httpBackend = $injector.get('$httpBackend');
    // add default response to all html files
    $httpBackend.whenGET(/views\/.*\.html/).respond(200, '');

    $cookies = $injector.get('$cookies');

    $scope = $injector.get('$rootScope');

    createController = function () {
      return $controller('LoginCtrl', {'$scope': $scope});
    };
  }));

  it('should be possible to request a token by providing valid user credentials', function () {
    createController();

    // add default response to all html files
    $httpBackend.when('POST', '/api/user/requestAuthToken')
      .respond(200, JSON.stringify({
        success: true,
        message: 'Successful logged in',
        token  : 'valid-token'
      }));

    $scope.login();
    $scope.$close = jasmine.createSpy();

    $httpBackend.expectPOST('/api/user/requestAuthToken');
    $httpBackend.flush();

    // the modal should be closed
    expect($scope.$close.calls.count()).toEqual(1);

    // the valid token should be set as a cookie
    expect($cookies.get('token')).toEqual('valid-token');
  });
});
