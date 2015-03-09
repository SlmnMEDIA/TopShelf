(function() {
    'use strict';
    /*
     * @ngdoc Controller
     * @name ResourceCtrl
     * @description Logic for displaying admin-resources in admin area
     */
    angular
        .module('app.admin.states')
        .controller('MediaCtrl', MediaCtrl);
    /* @ngInject */
    function MediaCtrl($rootScope, FileUploader, $state, $scope, $http, toastr, $location) {

        $scope.files = {};
        $scope.current = {};
        $scope.selectedImages = {};
        $scope.showMediaLibrary = true;

        var uploader = $scope.uploader = new FileUploader({
            url: '/api/files'
        });
        // FILTERS
        $http.get('/api/files').success(function(files) {
            $scope.files = files;
        });
        $scope.uploader.filters.push({
            name: 'customFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                return this.queue.length < 10;
            }
        });

        // CALLBACKS

        uploader.onWhenAddingFileFailed = function(item /*{File|FileLikeObject}*/ , filter, options) {
            console.info('onWhenAddingFileFailed', item, filter, options);
        };
        uploader.onAfterAddingFile = function(fileItem) {
            console.info('onAfterAddingFile', fileItem);
        };
        uploader.onAfterAddingAll = function(addedFileItems) {
            console.info('onAfterAddingAll', addedFileItems);
        };
        uploader.onBeforeUploadItem = function(item) {
            console.info('onBeforeUploadItem', item);
        };
        uploader.onProgressItem = function(fileItem, progress) {
            console.info('onProgressItem', fileItem, progress);
        };
        uploader.onProgressAll = function(progress) {
            console.info('onProgressAll', progress);
        };
        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            console.info('onSuccessItem', fileItem, response, status, headers);
        };
        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };
        uploader.onCancelItem = function(fileItem, response, status, headers) {
            console.info('onCancelItem', fileItem, response, status, headers);
        };
        uploader.onCompleteItem = function(fileItem, response, status, headers) {

            console.info('onCompleteItem', fileItem, response, status, headers);
        };
        uploader.onCompleteAll = function() {
            $http.get('/api/files').success(function(files) {
                $scope.files = files;
            });
        };
    }
})();