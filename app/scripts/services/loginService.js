angular.module('letItDropApp')
  .service('LoginService', ['$cookies', '$uibModal', '$location', '$routeParams', function ($cookies, $uibModal, $location, $routeParams) {

    var modal;

    return {
      /**
       * store the given drop zone key
       * @param key
       */
      setDropZoneKey: function (key) {
        $cookies.put('dropZoneKey', key);
        if (key) {
          $location.path('/dropZone/' + key);
        } else {
          $location.path('/dropZone');
        }
      },

      /**
       * return current drop zone key
       * @returns {*|string}
       */
      getDropZoneKey: function () {
        return $routeParams.dropZoneId || $cookies.get('dropZoneKey');
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
        const dropZoneKey = this.getDropZoneKey();
        if (!dropZoneKey) {
          modal = $uibModal.open({
            templateUrl : 'views/login.html',
            controller  : 'LoginCtrl',
            controllerAs: 'ctrl',
            keyboard    : false,
            backdrop    : 'static'
          });
        } else {
          this.setDropZoneKey(dropZoneKey);
        }
      }
    }

  }]);