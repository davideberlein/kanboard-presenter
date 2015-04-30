(function () {
    var app = angular.module("kanboard-presenter");
    app.service('KanboardService', ["$http", function ($http) {
        return {
            getProjectsByUser: function (userId) {
                return $http.get('/api/kanboard/users/'+userId+'/projects').then(function (response) {
                    return response.data;
                });
            },
            getBoard: function (projectId) {
                return $http.get('/api/kanboard/projects/'+projectId+'/board').then(function (response) {
                    return response.data;
                });
            },
            getCategories: function () {
                return $http.get('/api/kanboard/categories').then(function (response) {
                    return response.data;
                });
            }
        };
    }]);
})();