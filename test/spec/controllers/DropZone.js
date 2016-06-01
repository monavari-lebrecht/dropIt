describe('Controller: DropZoneCtrl', function () {

  var $controller;
  var loginService;
  var createController;
  var $rootScope;
  var $httpBackend;
  var $state;
  var $stateParams;

  beforeEach(function () {
    module('letItDropApp');

    inject(function ($injector) {
      loginService = $injector.get('LoginService');
      $controller  = $injector.get('$controller');
      $rootScope   = $injector.get('$rootScope');
      $state       = $injector.get('$state');
      $stateParams = $injector.get('$stateParams');
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'api/dropZone/some-valid-key')
        .respond(200, '');
      $httpBackend.when('GET', 'api/dropZone/some-invalid-key')
        .respond(404, '');

      // add request to openDropZone with a "valid key"
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
      $httpBackend.whenPOST('api/dropZone/create')
        .respond(function (method, url, data, headers) {
          return (headers['x-access-token'] === 'some-valid-token') ? [200, {}, {}] : [401, {}, {}];
        });

      // add default response to all html files
      $httpBackend.whenGET(/views\/.*\.html/).respond(200, '');
    });

    createController = function () {
      return $controller('DropZoneCtrl', {
        '$scope': $rootScope,
        '$state': $state
      });
    }
  });

  it('should try to load all files from a given drop zone', function () {
    $stateParams.dropZoneId = 'some-valid-key';
    createController();

    $httpBackend.expectGET('api/dropZone/some-valid-key');
    $httpBackend.flush();
  });

  it('should open the login dialog, if the user has no valid token or create a new drop zone if the token is valid', function () {
    createController();

    // test with invalid token
    loginService.login = jasmine.createSpy();

    loginService.token = 'invalid-token';
    $rootScope.create();

    $httpBackend.expectPOST('api/dropZone/create');
    $httpBackend.flush();

    expect(loginService.login.calls.count()).toEqual(1);

    loginService.token = 'some-valid-token';
    $rootScope.create();

    $httpBackend.expectPOST('api/dropZone/create');
    $httpBackend.flush();

    expect(loginService.login.calls.count()).toEqual(1);
  });
});
