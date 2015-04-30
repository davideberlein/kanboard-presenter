var DEBUG = false;

var _ = require('underscore'),
    kanboardApi = require('./kanboard-api');

// Enter the API-URL and API-Token of your Kanboard here.
kanboardApi.configureServer('https://YOUR.SERVER.URL/jsonrpc.php','YOUR.SERVER.API.TOKEN');

module.exports = function (app) {

    // server routes ===========================================================

    app.get('/api/kanboard/projects', function (req, res) {
        kanboardApi.getAllProjects().then(function (projects) {
            if(DEBUG) console.log('projects: ', projects);
            res.json(projects);
        },function(err){
            res.status(500).json(err);
        });
    });

    app.get('/api/kanboard/projects/:id/members', function (req, res) {
        kanboardApi.getMembersByProject(req.param("id")).then(function (members) {
            console.log('members: ', members);
            res.json(members);
        },function(err){
            res.status(500).json(err);
        });
    });

    app.get('/api/kanboard/users/:id/projects', function (req, res) {
        var userId = req.param("id");
        kanboardApi.getProjectsByUser(userId).then(function (projects) {
            if(DEBUG) console.log('projects for userid: ' + userId, projects);
            res.json(projects);
        },function(err){
            res.status(500).json(err);
        });
    });

    app.get('/api/kanboard/projects/:id/board', function (req, res) {
        var projectId = req.param("id");
        kanboardApi.getBoard(projectId).then(function (projects) {
            if(DEBUG) console.log('board for project: ' + projectId, projects);
            res.json(projects);
        },function(err){
            res.status(500).json(err);
        });
    });

    app.get('/api/kanboard/categories', function (req, res) {
        kanboardApi.getAllCategories().then(function (categories) {
            if(DEBUG) console.log('categories: ', categories);
            res.json(categories);
        },function(err){
            res.status(500).json(err);
        });
    });

};