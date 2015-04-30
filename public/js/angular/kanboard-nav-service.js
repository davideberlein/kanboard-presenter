(function () {
    var app = angular.module("kanboard-presenter");
    app.service('KanboardNavService', ["$state", "$stateParams", function ($state, $stateParams) {
        return {
            getActiveIndex: function (projects) {
                var index = 0;
                if ($stateParams.id) {
                    index = _.findIndex(projects, {id: $stateParams.id});
                }
                return index;
            },

            areProjectsEqual: function (projects1, projects2) {
                if (!(_.isArray(projects1) && _.isArray(projects2))) {
                    return false;
                }
                if (projects1.length !== projects2.length) {
                    return false;
                }
                for (var i = 0; i < projects1.length; i++) {
                    if (projects1[i].id !== projects2[i].id) {
                        return false;
                    }
                }
                return true;
            },

            scrollToBottom: function (scrollContainer) {
                var scrollToY = scrollContainer.scrollHeight - scrollContainer.offsetHeight;
                var scrollOffset = scrollToY - scrollContainer.scrollTop;
                var scrollDuration = ((scrollOffset) / 50) * 1000;
                return angular.element(scrollContainer).scrollTo(0, scrollToY, scrollDuration, function (x) {
                    return x;
                });
            },

            cancelScrolling: function (scrollContainer) {
                var ngScrollContainer = angular.element(scrollContainer);
                // Trigger new scroll event to current scroll position to cancel last scrolling.
                ngScrollContainer.scrollTo(0, ngScrollContainer.scrollTop(), 0);
            },

            goToNext: function (projects) {
                var index = this.getActiveIndex(projects);
                index = (index + 1) % projects.length;
                $state.go("board", {
                    id: projects[index].id
                });
            }
        };
    }]);
})();