angular.module('letItDropApp')
  .service('LoginService', ['$cookies', '$uibModal', function ($cookies, $uibModal) {

    return {
      /**
       * check if the current user is logged and show login modal if not
       */
      checkDropZoneStatus: function () {
        // check if a valid key is given...
        var key = $cookies.get('dropZoneKey');
        if (!key) {
          $uibModal.open({
            templateUrl : 'views/login.html',
            controller  : 'LoginCtrl',
            controllerAs: 'ctrl',
            keyboard    : false,
            backdrop    : 'static'
          });
        }
      }
    }

  }]);
