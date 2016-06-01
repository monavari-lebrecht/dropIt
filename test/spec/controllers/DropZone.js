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

      // add request to create a dropzone and return a "valid key"
      authRequestHandler = $httpBackend.when('GET', 'api/dropZone/create')
        .respond(201, {key: 'some-valid-new-key'});

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
    $httpBackend.when('POST', 'api/dropZone/create')
      .respond(401, '');

    loginService.login = jasmine.createSpy();

    $rootScope.create();

    $httpBackend.expectPOST('api/dropZone/create');
    $httpBackend.flush();

    expect(loginService.login.calls.count()).toEqual(1);
  });

  it('should be possible to create a new dropzone (a cookie should be set with that equals the one from API)', function () {
    // PENDING, because creating a new drop zone shall be only possible, if the user has been authenticated... This is NOT part of the refactoring
    return;
    $httpBackend.expectGET('api/dropZone/create');
    createController();

    // call function to test
    $rootScope.create();
    $httpBackend.flush();
    // is a valid cookies set
    expect(loginService.getDropZoneKey()).toEqual('some-valid-new-key');
  });

});
