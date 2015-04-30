/**
 * Created by truebden on 19.03.2015.
 */

(function () {

    var KanboardPresenter = angular.module('kanboard-presenter');

    /**
     * Main controller that should contain the complete app initialization.
     */
    KanboardPresenter.controller('KanboardNavCtrl', ['$q', '$rootScope', '$state', '$timeout', '$stateParams', '$document', 'KanboardService', 'KanboardNavService', function ($q, $rootScope, $state, $timeout, $stateParams, $document, KanboardService, KanboardNavService) {
        var self = this;

        self.projects = null;
        self.stateParams = $stateParams;
        self.paused = false;
        self.timeoutPromise = undefined;

        self.isPaused = function () {
            return self.paused;
        };
        self.togglePaused = function () {
            self.paused = !self.paused;
            if (self.paused) {
                KanboardNavService.cancelScrolling(document.getElementsByClassName("scroll-container")[0]);
                $timeout.cancel(self.timeoutPromise);
            } else {
                cycleThroughProjects("scroll");
            }
        };

        function getUserProjects(userId) {
            var deferred = $q.defer();
            KanboardService.getProjectsByUser(userId).then(function (projects) {
                projects = _.sortBy(projects, "name");
                if (!KanboardNavService.areProjectsEqual(projects, self.projects)) {
                    self.projects = projects;
                }
                if (self.paused) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
            });
            return deferred.promise;
        }

        function cycleThroughProjects(startStep) {
            var promise = $q.when();
            if (!_.isString(startStep)) {
                startStep = "getProjects";
            }
            switch (startStep) {
                case "getProjects":
                    promise = promise.then(function () {
                        var userId = $stateParams.userId ? $stateParams.userId : 17;
                        return getUserProjects(userId);
                    }).then(function () {
                        self.timeoutPromise = $timeout(angular.noop, Math.PI * 1000);
                        return self.timeoutPromise;
                    });
                case "scroll":
                    promise = promise.then(function () {
                        return KanboardNavService.scrollToBottom(document.getElementsByClassName("scroll-container")[0]);
                    }).then(function () {
                        self.timeoutPromise = $timeout(angular.noop, Math.PI * 1000);
                        return self.timeoutPromise;
                    });
                case "nextPage":
                    promise = promise.then(function () {
                        KanboardNavService.goToNext(self.projects);
                    });
            }
            promise.catch(function (error) {
                console.error("Got Error, pausing", error);
                self.paused = true;
            });
        }

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            if (toState.name !== "board") {
                return;
            }
            // cancel open promises
            $timeout.cancel(self.timeoutPromise);

            var userId = 17;
            if (toParams.userId) {
                userId = toParams.userId;
            }
            cycleThroughProjects();
        });
    }]);

})();