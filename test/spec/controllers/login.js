'use strict';

describe('Controller: LoginCtrl', function () {

  var $httpBackend;
  var authRequestHandler;
  var createController;
  var $rootScope;
  var $cookies;
  var loginService;

  // load the controller's module
  beforeEach(module('letItDropApp'));

  beforeEach(inject(function ($injector) {
    // mock http backend
    $httpBackend = $injector.get('$httpBackend');

    // add request to create a dropzone and return a "valid key"
    authRequestHandler = $httpBackend.when('GET', 'api/dropZone/create')
      .respond(201, {key: 'some-valid-new-key'});

    // add request to login with a "valid key"
    $httpBackend.when('GET', 'api/dropZone/some-valid-key/exists')
      .respond(200, '');
    $httpBackend.when('GET', 'api/dropZone/some-invalid-key/exists')
      .respond(404, '');
    $httpBackend.when('GET', 'api/dropZone/some-valid-key/listFiles')
      .respond(200, {
        filesCount: 1,
        files     : [
          {
            name: 'image1',
            path: 'path/To/Image1.png'
          }
        ]
      });

    // add default response to all html files
    $httpBackend.whenGET(/views\/.*\.html/).respond(200, '');

    // Get hold of a scope (i.e. the root scope)
    $rootScope = $injector.get('$rootScope');

    // get cookies
    $cookies = $injector.get('$cookies');

    loginService = $injector.get('LoginService');

    // The $controller service is used to create instances of controllers
    var $controller = $injector.get('$controller');

    createController = function () {
      return $controller('LoginCtrl', {'$scope': $rootScope, '$cookies': $cookies});
    };
  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should be possible to create a new dropzone (a cookie should be set with that equals the one from API)', function () {
    $httpBackend.expectGET('api/dropZone/create');
    createController();

    // call function to test
    $rootScope.create();
    $httpBackend.flush();
    // is a valid cookies set
    expect(loginService.getDropZoneKey()).toEqual('some-valid-new-key');
  });

  it('should be possible to login into a valid drop zone (setting a cookie, if valid, and remove the cookie if not)', function () {
    createController();

    // Test a valid key
    $httpBackend.expectGET('api/dropZone/some-valid-key/exists');
    $rootScope.dropZoneKey = 'some-valid-key';
    $rootScope.login();
    $httpBackend.flush();
    // a corresponding cookie should be set
    expect(loginService.getDropZoneKey()).toEqual('some-valid-key');

    $httpBackend.expectGET('api/dropZone/some-invalid-key/exists');
    // Test an invalid key
    $rootScope.dropZoneKey = 'some-invalid-key';
    $rootScope.login();
    $httpBackend.flush();

    // a corresponding cookie should be set
    expect(loginService.getDropZoneKey()).toEqual(undefined);
  });
});
