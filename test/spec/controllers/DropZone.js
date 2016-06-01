describe('Controller: DropZoneCtrl', function () {

  var $controller;
  var loginService;
  var createController;
  var $rootScope;
  var $httpBackend;

  beforeEach(function () {
    module('letItDropApp');

    inject(function ($injector) {
      loginService = $injector.get('LoginService');
      $controller  = $injector.get('$controller');
      $rootScope   = $injector.get('$rootScope');
      $state       = $injector.get('$state');
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
      return $controller('DropZoneCtrl', {'$scope': $rootScope});
    }
  });

  it('should try to load all files from a given drop zone', function () {
    loginService.setDropZoneKey('some-valid-key');

    $httpBackend.expectGET('api/dropZone/some-valid-key');
    createController();
    $httpBackend.flush();
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

  it('should be possible to openDropZone into a valid drop zone (setting a cookie, if valid, and remove the cookie if not)', function () {
    createController();

    // Test a valid key
    $httpBackend.expectGET('api/dropZone/some-valid-key/exists');
    $state.go('dropZone.show', {dropZoneKey: 'some-valid-key'});
    $rootScope.dropZoneKey = 'some-valid-key';
    $rootScope.openDropZone();
    $httpBackend.flush();
    // a corresponding cookie should be set
    expect(loginService.getDropZoneKey()).toEqual('some-valid-key');

    $httpBackend.expectGET('api/dropZone/some-invalid-key/exists');
    // Test an invalid key
    $state.go('dropZone.show', {dropZoneKey: 'some-invalid-key'});
    $rootScope.dropZoneKey = 'some-invalid-key';
    $rootScope.openDropZone();
    $httpBackend.flush();

    // a corresponding cookie should be set
    expect(loginService.getDropZoneKey()).toEqual(undefined);
  });

});
