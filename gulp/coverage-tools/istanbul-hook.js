/**
 * File used to cope with the problem of the node module 'istanbul'
 * which is not able to hook on runInNewContext.
 * This file is based on the issue: https://github.com/gotwarlost/istanbul/issues/293
 * And on the pull request: https://github.com/gotwarlost/istanbul/pull/294
 * This files used some functions, or the skeletons of functions from the node modules:
 * 	- 'istanbul'
 * 	- 'gulp-istanbul'
 */

///////////////////////////////
/// Definition of Varaibles ///
///////////////////////////////

// Variable for both part of the file
var path = require('path');

// Variables for the definition of hookRunInNewContext
var fs = require('fs');
var Module = require('module');
var vm = require('vm');
var originalLoaders = {};
var originalCreateScript = vm.createScript;
var originalRunInThisContext = vm.runInThisContext;
var originalRunInNewContext = vm.runInNewContext;

// Variable for the definition of hookRequireGulp
var through = require('through2').obj;
var checker = require('istanbul-threshold-checker');
// Make sure istanbul is `require`d after the istanbul-threshold-checker to use the istanbul version
// defined in this package.json instead of the one defined in istanbul-threshold-checker.
var istanbul = require('istanbul');

//////////////////////////////////
/// Definition of hookRunInNew ///
//////////////////////////////////

function transformFn(matcher, transformer, verbose) {

    return function (code, filename) {
        var shouldHook = typeof filename === 'string' && matcher(path.resolve(filename)),
            transformed,
            changed = false;

        if (shouldHook) {
            if (verbose) {
                console.error('Module load hook: transform [' + filename + ']');
            }
            try {
                transformed = transformer(code, filename);
                changed = true;
            } catch (ex) {
                console.error('Transformation error; return original code');
                console.error(ex);
                transformed = code;
            }
        } else {
            transformed = code;
        }
        return { code: transformed, changed: changed };
    };
}


/**
 * hooks `vm.runInNewContext` to return transformed code.
 * @method hookRunInNewContext
 * @static
 * @param matcher {Function(filePath)} a function that is called with the filename passed to `vm.runInNewContext`
 *  Should return a truthy value when transformations need to be applied to the code, a falsy value otherwise
 * @param transformer {Function(code, filePath)} a function called with the original code and the filename passed to
 *  `vm.createScript`. Should return the transformed code.
 * @param options {Object} options Optional.
 * @param {Boolean} [options.verbose] write a line to standard error every time the transformer is called
 */
function hookRunInNewContext(matcher, transformer, opts) {
    opts = opts || {};
    var fn = transformFn(matcher, transformer, opts.verbose);
    vm.runInNewContext = function (code, context, file) {
        var ret = fn(code, file);
        Object.keys(global).forEach(function(key) {
          if (key.indexOf('$$cov_') === 0) {
            context[key] = global[key];
          }
        });
        return originalRunInNewContext(ret.code, context, file);
    };
}

/**
 * unhooks vm.runInNewContext, restoring it to its original state.
 * @method unhookRunInNewContext
 * @static
 */
function unhookRunInNewContext() {
    vm.runInNewContext = originalRunInNewContext;
}


/////////////////////////////////////
/// Definition of hookRequireGulp ///
/////////////////////////////////////

function normalizePathSep(filepath) {
  return filepath.replace(/\//g, path.sep);
}


function hookRequireGulp(options) {
  var fileMap = {};

  istanbul.hook.unhookRequire();

// Hook on the RunInThisContext (call istanbul.hook function)
  istanbul.hook.hookRunInThisContext(function (path) {
    return !!fileMap[normalizePathSep(path)];
  }, function (code, path) {
    return fileMap[normalizePathSep(path)];
  }, options);

// Hook on the RunInNewsContext (call the internal implementation of the function)
  hookRunInNewContext(function (path) {
    return !!fileMap[normalizePathSep(path)];
  }, function (code, path) {
    return fileMap[normalizePathSep(path)];
  }, options);

// Hook on Require (call istanbul.hook function)
  istanbul.hook.hookRequire(function (path) {
    return !!fileMap[normalizePathSep(path)];
  }, function (code, path) {
    return fileMap[normalizePathSep(path)];
  }, options);

  return through(function (file, enc, cb) {
    // If the file is already required, delete it from the cache otherwise the covered
    // version will be ignored.
    delete require.cache[path.resolve(file.path)];
    fileMap[normalizePathSep(file.path)] = file.contents.toString();
    return cb();
  });
};


module.exports = {
    hookRequire: hookRequireGulp
};