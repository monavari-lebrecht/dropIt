angular.module('letItDropApp')
  .service('LoginService', ['$cookies', '$uibModal', '$location', '$stateParams', '$state', function ($cookies, $uibModal, $location, $stateParams, $state) {
    var modal;

    return {
      /**
       * check if the current user is logged and show openDropZone modal if not
       */
      login: function () {
        // check if a valid key is given...
        modal = $uibModal.open({
          templateUrl : 'views/login.html',
          controller  : 'LoginCtrl',
          controllerAs: 'ctrl',
          keyboard    : false,
          backdrop    : 'static'
        });
      }
    }

  }]);
