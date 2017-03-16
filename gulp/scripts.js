'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('../gulpfile.config');

var $ = require('gulp-load-plugins')();

var tsProjectBuild = $.typescript.createProject('tsconfig-build.json');
var tsProjectTest = $.typescript.createProject('tsconfig-test.json');

// Transpile typescript files to destPath
// A specific string replacement is done to manage shared sources files with UI
function transpile(tsProject, destPath) {
    return tsProject.src()
        .pipe($.sourcemaps.init())
        .pipe($.tslint())
        .pipe($.tslint.report('prose', {emitError: false}))
        .pipe(tsProject()).on('error', conf.errorHandler('TypeScript'))
        .pipe($.sourcemaps.write({
            includeContent: true,
            sourceRoot: 'sources/'
        }))
        // Replace included shared files path
        //.pipe($.replace('../../share/', ''))
        .pipe(gulp.dest(destPath));
}

// Transpile typescript application source files
gulp.task('scripts:sources', function() {
    return transpile(tsProjectBuild, path.join(conf.paths.tmp)
    );
});

// Transpile typescript source and test files
gulp.task('scripts:tests', function() {
    return transpile(tsProjectTest, path.join(conf.paths.tmpTests)
    );
});
