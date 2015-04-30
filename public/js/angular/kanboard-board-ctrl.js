/**
 * Created by truebden on 19.03.2015.
 */

(function () {

    var KanboardPresenter = angular.module('kanboard-presenter');

    KanboardPresenter.controller('KanboardPresenterCtrl', ['KanboardService', '$stateParams', function (KanboardService, $stateParams) {
        var self = this;
        self.board;

        self.categories = {};


        KanboardService.getBoard($stateParams.id).then(function (board) {
            self.board = board;
        })

        KanboardService.getCategories().then(function (categories) {
            angular.forEach(categories, function (category) {
                self.categories[category.id] = category.name;
            });
        })
    }]);

})();