/*
 * GULP TASKS CONFIGURATION
 * This file contains the variables used in gulp tasks.
 */

'use strict';

var gutil = require('gulp-util');

/**
 * The main paths of your project, handle these with care.
 */
exports.paths = {
  src: 'sources',
  dist: 'dist',
  tmp: '.tmp',
  tmpTests: '.tmpTests'
};

/**
 * Common implementation for an error handler of a gulp plugin.
 */
exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
