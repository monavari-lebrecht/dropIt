angular.module('letItDropApp')
  .service('LoginService', ['$cookies', '$uibModal', function ($cookies, $uibModal) {

    var modal;
    var dropZoneKey = $cookies.get('dropZoneKey');

    return {
      /**
       * returns instance of the login modal
       * @returns {*}
       */
      getModal: function () {
        return modal;
      },

      /**
       * store the given drop zone key
       * @param key
       */
      setDropZoneKey: function (key) {
        $cookies.put('dropZoneKey', key);
        dropZoneKey = key;
      },

      /**
       * return current drop zone key
       * @returns {*|string}
       */
      getDropZoneKey: function () {
        return dropZoneKey;
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
        if (!dropZoneKey) {
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
