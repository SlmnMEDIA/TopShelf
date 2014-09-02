(function() {

'use strict';

function AdminCtrl($http, Auth, User) {

        // Capture the 'this' context of the controller using vm, standing for ViewModel.
        // Use it to avoid having to call bind and unnecessary scoping issues.
        var vm = this;

        vm.someObject = 'Some value';

        vm.stuff = [];
    }
    
  angular.module('app')
    .controller('AdminCtrl', AdminCtrl);
})();