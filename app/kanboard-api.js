var q = require('q'),
    _ = require('underscore'),
    Client = require('node-rest-client').Client;

var client = undefined;
var boardUrl = undefined;

var rpcId = 0;

function rpcJsonCall(method, params) {
    var deferred = q.defer();

    if(client === undefined || boardUrl === undefined){
        deferred.reject("The client has to be configured using configureServer() before any service can be called.")
        return deferred.promise;
    }

    var args = {
        data: {
            "jsonrpc": "2.0",
            "method": method,
            "id": rpcId++
        },
        headers: {"Content-Type": "application/json"}
    };
    if (_.isArray(params)) {
        args.data.params = params;
    }

    client.post(boardUrl, args, function (data, response) {
        deferred.resolve(data.result);
    }).on('error', function (err) {
        console.error(new Date() + ' Something went wrong on the request: ' + method + ' params: ' + params, err);
        deferred.reject(err);
    });

    return deferred.promise;
}


module.exports = {

    configureServer: function (serverUrl, apiToken) {
        boardUrl = serverUrl;

        // Setup the client
        var options = {
            user: "jsonrpc",
            password: apiToken
        };
        client = new Client(options);
        // handling client error events
        client.on('error', function (err) {
            console.error(new Date() + ' Something went wrong on the rest client', err);
        });
    },

    /**
     * Returns all messages in the inbox as array.
     */
    getAllProjects: function () {
        return rpcJsonCall("getAllProjects");
    },

    getMembersByProject: function (projectId) {
        return rpcJsonCall("getMembers", [parseInt(projectId)]);
    },

    getBoard: function (projectId) {
        return rpcJsonCall("getBoard", [parseInt(projectId)]);
    },

    getProjectsByUser: function (userId) {
        var service = this;
        var deferred = q.defer();
        var userProjects = [];
        var openRequests = 0;

        var addUserProjects = function (project) {
            service.getMembersByProject(project.id).then(function (users) {
                openRequests--;
                var foundUser = users[userId];

                if (foundUser) {
                    userProjects.push(project);
                }

                if (openRequests <= 0) {
                    deferred.resolve(userProjects);
                }
            }, function () {
                openRequests--;
            });
        };

        service.getAllProjects().then(function (projects) {
            openRequests = projects.length;
            for (var i = 0; i < projects.length; i++) {
                addUserProjects(projects[i]);
            }
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    },

    getCategoriesByProject: function (projectId) {
        return rpcJsonCall("getAllCategories", [parseInt(projectId)]);
    },

    getAllCategories: function () {
        var service = this;
        var deferred = q.defer();
        var allCategories = [];
        var openRequests = 0;

        var addProjectCategories = function (project) {
            service.getCategoriesByProject(project.id).then(function (categories) {
                openRequests--;
                allCategories = allCategories.concat(categories);

                if (openRequests <= 0) {
                    deferred.resolve(allCategories);
                }
            }, function () {
                openRequests--;
            });
        };

        service.getAllProjects().then(function (projects) {
            openRequests = projects.length;
            for (var i = 0; i < projects.length; i++) {
                addProjectCategories(projects[i]);
            }
        }, function (err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }
};
