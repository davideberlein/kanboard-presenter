/**
 * Created by truebden on 18.03.2015.
 */

(function () {
    var KanboardPresenter = angular.module('kanboard-presenter', ['ui.router', 'ngMaterial', 'ngAnimate', 'duScroll']);

    KanboardPresenter.config(['$urlRouterProvider', '$stateProvider', '$mdThemingProvider', function ($urlRouterProvider, $stateProvider, $mdThemingProvider) {
        // Routes
        $urlRouterProvider.otherwise('/user/1/board/1');
        $stateProvider.state({
            name: 'board',
            url: '/user/{userId:int}/board/{id}',
            templateUrl: 'html/templates/board-material.html'
        });

        // ngMaterial Theme
        $mdThemingProvider.theme('default')
            .primaryPalette('blue')
            .accentPalette('yellow');

    }]);
}());
