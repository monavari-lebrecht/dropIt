describe('Service: LoginService', function () {
  var serviceUnderTest;
  var $uibModal;
  var $cookies;

  beforeEach(module('letItDropApp'));

  beforeEach(inject(function ($injector) {
    $uibModal = $injector.get('$uibModal');

    $cookies = $injector.get('$cookies');

    serviceUnderTest = $injector.get('LoginService', {
      '$uibModal': $uibModal
    });
  }));

  it('should open a modal if no dropZoneKey cookie could be found', function () {
    $uibModal.open = jasmine.createSpy();
    serviceUnderTest.checkDropZoneStatus();

    $cookies.put('dropZoneKey', 'some-key');

    serviceUnderTest.checkDropZoneStatus();

    // modal should be opened only the first time, because, there was no cookie at that time
    expect($uibModal.open.calls.count()).toEqual(1);
  });
});
