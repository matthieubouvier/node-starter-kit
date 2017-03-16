'use strict';

var path = require('path');
var gulp = require('gulp');
var shell = require('gulp-shell');
var conf = require('../gulpfile.config');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'del']
});

// Exclude folders without file
var fileFilter = $.filter(function(file) {
  return file.stat.isFile();
});

// Build typescript files and copy
gulp.task('build:sources', ['scripts:sources'], function() {
  return gulp.src([
      path.join(conf.paths.tmp, '/**/*')
  ])
    .pipe(fileFilter)
    .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

// Copy all javascript sources files

gulp.task('other', function() {
  return gulp.src([
      path.join(conf.paths.src, '/node_modules/**/*'),
      path.join('!' + conf.paths.src, '/**/*.md'),
      path.join('!' + conf.paths.src, '/**/LICENSE'),
      path.join('!' + conf.paths.src, '/**/Makefile'),
      path.join('!' + conf.paths.src, '/**/bower.json')
  ])
    .pipe(gulp.dest(path.join(conf.paths.dist, '/node_modules/')));
});

gulp.task('manageNodeModules', ['distNodeInstall'], shell.task('rm ' + path.join(conf.paths.dist, 'package.json')));

gulp.task('distNodeInstall', ['copyNodeConfig'], shell.task('npm install --only=production --prefix ' + conf.paths.dist));

gulp.task('copyNodeConfig', ['makeDistNode'], shell.task('cp package.json ' + conf.paths.dist));

gulp.task('makeDistNode', shell.task('mkdir -p ' + path.join(conf.paths.dist, '/node_modules/')));

// Build all and list deployed files
gulp.task('build', ['build:sources', 'manageNodeModules'], function () {
  return gulp.src([
      path.join(conf.paths.dist, '/**/*')
    ])
    .pipe($.size({title: path.join(conf.paths.dist, '/'), showFiles: false}));
});

// Clean temp and dist folders
gulp.task('clean', function() {
  return $.del([conf.paths.dist, conf.paths.tmp, conf.paths.tmpTests]);
});
