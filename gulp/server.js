'use strict';

var gulp = require('gulp');
var server = require('gulp-develop-server');
var path = require('path');
var conf = require('../gulpfile.config');

// Build server to launch it
gulp.task('serve', ['build'], function(){
    server.listen({ path: path.join(conf.paths.dist, '/server/sources/app.js')});
});
