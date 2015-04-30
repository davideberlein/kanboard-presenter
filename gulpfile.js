/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp'),
    bower = require('gulp-bower'),
    del = require('del'),
    _ = require('underscore'),
    NwBuilder = require('node-webkit-builder');

var paths = {
    src: ['package.json', 'server.js', 'public/**/*', "app/**/*"],
    libs: {
        node: ['node_modules/**/*', '!node_modules/{bower,del,gulp*,nw,node-webkit-builder}/**/*'],
        bower: ['bower_components/**/*']
    },
    bower: 'bower.json',
    build: 'build'
};


gulp.task('bower:clean', function (cb) {
    del(paths.libs.bower, cb);
});

gulp.task('bower:build', ['bower:clean'], function () {
    return bower();
});

gulp.task('nw:clean', function (cb) {
    del(paths.build, cb);
});

gulp.task('nw:build', ['nw:clean'], function (cb) {
    var nwBuilder = new NwBuilder({
        files: _.flatten([paths.src, paths.libs.node, paths.libs.bower]),
        platforms: ['win32', 'win64', 'linux32', 'linux64'],
        buildDir: paths.build
    });

    nwBuilder.on('log', console.log);
    nwBuilder.build().then(function () {
        console.log("Build Finished");
        cb();
    }).catch(function (error) {
        console.error(error);
        cb();
    });
});