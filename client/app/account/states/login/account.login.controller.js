(function () {
    'use strict';

  /**
   * @ngdoc object
   * @name user.login.controller:LoginCtrl
   *
   * @description
   *
   */
    angular
        .module('topshelf.account.states')
        .controller('LoginCtrl', LoginCtrl);

    function LoginCtrl() {
        var vm = this;
        vm.ctrlName = 'LoginCtrl';
    }

})();