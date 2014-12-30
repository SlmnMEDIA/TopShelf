(function () {
    'use strict';

  /**
   * @ngdoc service
   * @name user.factory:User
   *
   * @description
   *
   */
    function User ($resource) {
        return $resource('/api/users/:id/:controller', {
              id: '@_id'
            },
            {
              changePassword: {
                method: 'PUT',
                params: {
                  controller:'password'
                }
              },
              get: {
                method: 'GET',
                params: {
                  id:'me'
                }
              },
              update: {
                method:'PUT'

              }
            });
    }
    angular
        .module('topshelf.account')
        .factory('User', User);
})();
