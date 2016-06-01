angular.module('letItDropApp')
  .service('LoginService', ['$cookies', '$uibModal', '$location', '$stateParams', function ($cookies, $uibModal, $location, $stateParams) {

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
        return $stateParams.dropZoneId || $cookies.get('dropZoneKey');
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
       * check if the current user is logged and show openDropZone modal if not
       */
      openDropZone: function () {
        // check if a valid key is given...
        const dropZoneKey = this.getDropZoneKey();
        if (!dropZoneKey) {
          modal = $uibModal.open({
            templateUrl : 'views/openDropZone.html',
            controller  : 'OpenDropZoneCtrl',
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
