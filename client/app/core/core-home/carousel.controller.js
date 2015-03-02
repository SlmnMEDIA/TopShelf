(function() {
    'use strict';
    /**
     * @name HomeCarouselCtrl as carousel
     * @desc Carousel controller
     * @requires (mgcrea.ngStrap)
     * @memberOf topshelf.core.states
     */

    angular
        .module('app.core.states')
        .controller('HomeCarouselCtrl', HomeCarouselCtrl);

    function HomeCarouselCtrl() {
        var carousel = this;

        /*
        @todo pull images from backend so that adding to the carousel is easier
        ,
            {
                image: 'assets/images/butcher.png'
            },
            {
                image: 'assets/images/banner1.jpg'
            },
            {
                image: 'assets/images/mythicBrack.png'
            }
       */
        carousel.slides = [{
            image: 'assets/images/mythic-koragh.jpg'

        }, {
            image: 'assets/images/blackhand-slider.jpg'
        }, {
            image: 'assets/images/mythic-butcher.jpg'
        }];

    }

})();