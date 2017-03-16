'use strict';

var gulp = require('gulp');
var conf = require('../gulpfile.config');
var gutil = require('gulp-util');

var path = require('path');
var tsd = require('tsd');

var tsdJson = 'tsd.json';
var tsdApi = new tsd.getAPI(tsdJson);

gulp.task('tsd', function() {

  // Get typings for sources node modules and jasmine
  var node = require(path.join(process.cwd(), 'package.json'));
  var dependencies = ['jasmine']
      .concat(Object.keys(node.dependencies));
console.log(dependencies);
  var query = new tsd.Query();
  dependencies.forEach(function(dependency) {
    query.addNamePattern(dependency);
  });

  var options = new tsd.Options();
  options.resolveDependencies = true;
  options.overwriteFiles = true;
  options.saveBundle = true;
  options.saveToConfig = true;

  return tsdApi.readConfig()
    .then(function() {
      return tsdApi.select(query, options);
    })
    .then(function(selection) {
      return tsdApi.install(selection, options);
    })
    .then(function(installResult) {
      var written = Object.keys(installResult.written.dict);
      var removed = Object.keys(installResult.removed.dict);
      var skipped = Object.keys(installResult.skipped.dict);

      written.forEach(function(dts) {
        gutil.log('Definition file written: ' + dts);
      });

      removed.forEach(function(dts) {
        gutil.log('Definition file removed: ' + dts);
      });

      skipped.forEach(function(dts) {
        gutil.log('Definition file skipped: ' + dts);
      });
    });
});

gulp.task('tsd:restore', function() {
  return tsdApi.readConfig()
    .then(function() {
      return tsdApi.reinstall(new tsd.Options());
    })
});

gulp.task('tsd:clean', function() {
  return tsdApi.purge(true, true);
});
