(function () {
  'use strict';

  /**
   * @ngdoc object
   * @name admin.recruitment.controller:ApplicationListCtrl
   *
   * @description
   *
   */
  angular
    .module('topshelf.admin')
    .controller('ApplicationListCtrl', ApplicationListCtrl);

  function ApplicationListCtrl($scope, $filter, ngTableParams, $http, $location, socket) {
   $http.get('/api/applications').success(function(applications) {
      $scope.applications = applications;
      socket.syncUpdates('applications', $scope.applications, function(event, application, applications) {
        // This callback is fired after the comments array is updated by the socket listeners

        // sort the array every time its modified
        applications.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
        });
    })
      var data = $scope.applications;

    $scope.tableParams = new ngTableParams({
        page: 1,            // show first page
        count: 10,          // count per page
        sorting: {
            charName: 'asc'     // initial sorting
        }
    }, {
        total: data.length, // length of data
        getData: function($defer, params) {
            // use build-in angular filter
            var orderedData = params.sorting() ?
                                $filter('orderBy')(data, params.orderBy()) :
                                data;

            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
        }
    })
  })
    $scope.selectApplication = function(application) {
        $location.path('/admin/applications/edit/' + application._id);
    }
    $scope.deleteApplication = function(application) {
        $http.delete('/api/applications/' + application._id).success(function() {
            $http.get('/api/applications').success(function(applications) {
              $scope.applications = applications;
            });
        });
    }


        $scope.getApplicationById = function(id) {
            var results = jQuery.grep($scope.application, function( application, i ) {
                return ( application._id === id );
            });
            return results[0];
        }



    $scope.addNew = function() {
        $location.path('/admin/applications/edit')
    }
  }

})();
