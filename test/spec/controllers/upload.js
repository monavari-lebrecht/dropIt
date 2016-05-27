describe('Controller: UploadCtrl', function () {

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
      $httpBackend = $injector.get('$httpBackend');
      $httpBackend.when('GET', 'api/dropZone/some-valid-key')
        .respond(200, '');
      $httpBackend.when('GET', 'api/dropZone/some-invalid-key')
        .respond(404, '');

      // add default response to all html files
      $httpBackend.whenGET(/views\/.*\.html/).respond(200, '');
    });

    createController = function () {
      return $controller('UploadCtrl', {'$scope': $rootScope});
    }
  });

  it('should check if the current drop zone exists', function () {
    loginService.openDropZone = jasmine.createSpy();
    createController();
    expect(loginService.openDropZone.calls.count()).toEqual(1);
  });

  it('should try to load all files from a given drop zone', function () {
    loginService.setDropZoneKey('some-valid-key');

    $httpBackend.expectGET('api/dropZone/some-valid-key');
    createController();
    $httpBackend.flush();
  });

});
