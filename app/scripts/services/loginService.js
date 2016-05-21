angular.module('letItDropApp')
  .service('LoginService', ['$cookies', '$uibModal', function ($cookies, $uibModal) {

    var modal;

    return {
      /**
       * returns instance of the login modal
       * @returns {*}
       */
      getModal: function () {
        return modal;
      },

      /**
       * closes the bootstrap modal
       */
      closeModal: function () {
        if (modal && typeof modal.close === 'function') {
          modal.close();
        }
      },

      /**
       * check if the current user is logged and show login modal if not
       */
      checkDropZoneStatus: function () {
        // check if a valid key is given...
        var key = $cookies.get('dropZoneKey');
        if (!key) {
          modal = $uibModal.open({
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
