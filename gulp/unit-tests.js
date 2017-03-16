'use strict';

var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var jasmine = require('gulp-jasmine');
var conf = require('../gulpfile.config');
var debug = require('gulp-debug');
var istanbul = require('gulp-istanbul');
var tap = require('gulp-tap');
var remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
var ownIstanbulTool = require('./coverage-tools/istanbul-hook');

var $ = require('gulp-load-plugins')();

var newman = require('newman'); // require newman in your project 

/*
 * List all test files
 */
function listFiles(dir) {
    if (dir && dir.length) {
        dir += "/";
    }
    else {
        dir = "";
    }
    return [
        path.join(conf.paths.tmpTests, '/**/'+dir+'*.spec.js')
    ];
}

function isCoverageEnabled()
{
    var coverage = false;
        process.argv.forEach(
            function(s) 
            {
                var index = s.indexOf("--coverage");
                if (index > -1) {
                    coverage = true;
                }
            }
        );
        return coverage;
}

/*
 * Check if the user wants to record the list of exluded files.
 */
function isExcludedFileListEnabled()
{
    var listExcluded = false;
    process.argv.forEach(
        function(s)
        {
            var index = s.indexOf("--list-excluded");
            if (index > -1) {
                listExcluded = true;
            }
        }
    );
    return listExcluded;
}

/*
 * Check if the user wants to exclude spec and mock file from the coverage.
 */
function areSpecAndMockFilesExcluded()
{
    var specAndMockExcluded = false;
        process.argv.forEach(
                function(s)
                {
                    var index = s.indexOf("--purecover");
                if (index > -1) {
                        specAndMockExcluded = true;
                    }
            }
        );
        return specAndMockExcluded;
}

function getTestDirectoryFilter()
{
    var dir = "";
        process.argv.forEach(
            function(s) 
            {
                var index = s.indexOf("--dir=");
                if (index > -1) {
                    dir = s.substring(index+6);
                }
            }
        );
        return dir;
}

/*
 * Clear the file containing the list of the files excluded from the remapping.
 */
function clearExcludedFileList()
{
    fs.writeFileSync(path.join(__dirname, '..','coverage', 'excluded_files.info'), "");
}

/*
* Write in a file the files which are excluding from the remapping.
*/
function listExcludedFile(file_path)
{
    fs.appendFileSync(path.join(__dirname, '..','coverage', 'excluded_files.info'), file_path+"\n");
}

function getTestReport()
{
    if (isCoverageEnabled())
    {
        clearExcludedFileList();
        var excludeRegex = '(.*\/create\_user\.js)|(.*\/node\_modules\/.*\.js)';
        if(areSpecAndMockFilesExcluded()){
            excludeRegex+='|(.*spec\.js)|(.*mock\.js)';
        }
        var saveFunction = function(){};
        if(isExcludedFileListEnabled()){
            saveFunction = listExcludedFile;
        }
        return gulp.src('coverage/coverage-final.json')
            .pipe(remapIstanbul({
                reports: {
                    'json': 'coverage/coverage-final.json',
                    'html': 'coverage/html-final',
                    'lcovonly': 'coverage/lcov-remap.info',
                    'text':'',
                    'text-summary' :''
                },
                exclude : [excludeRegex],
                warn : saveFunction
            })).on('end', function()
            {
                var lcov = fs.readFileSync(path.join(__dirname, '..', 'coverage', 'lcov-remap.info')).toString();
                lcov = lcov.replace(/SF:\.\.\//g, "SF:");
                fs.writeFileSync(path.join(__dirname, '..', 'coverage', 'lcov-final.info'), lcov);
            });
    }
    else
    {
        return true;
    }
}

gulp.task('test:run', ['scripts:tests', 'test:coverage:preprocess'], function()
{
    var dir = getTestDirectoryFilter();
    var enableCoverage = isCoverageEnabled();
    var pipe = gulp.src(listFiles(dir))
                .pipe(jasmine({
            verbose: true,
            errorOnFail: false
        }));
    if (enableCoverage)
    {
        pipe = pipe.pipe(istanbul.writeReports());
    }
    return pipe;
});

gulp.task('test:coverage:preprocess', function()
{
    if (isCoverageEnabled())
    {
        var dir = getTestDirectoryFilter();
        return gulp.src([path.join(conf.paths.tmpTests, '/**/'+dir+'*.js')], {nodir: true})
            .pipe(istanbul({
                includeUntested: true
            }))
            // The hookRequire from the node module gulp-istanbul (imported as 'istanbul' in this file')
            // does not support the call of the function runInNewContext().
            // Using our ownIstanbulTool allows us to call a hook on the runInNewContext to get accurate pieces of coverage information.
            //.pipe(istanbul.hookRequire())
            .pipe(ownIstanbulTool.hookRequire())
            .pipe(tap(function(f) {
                // Make sure all files are loaded to get accurate coverage data
                require(f.path);
            }));
    }
    return true;
    
});

/*
 * Compile then run tests
 */
gulp.task('test', ['scripts:tests', 'test:run'], function() {
    return getTestReport();
});

/*
 * Simply run tests
 */
gulp.task('test:simple', ['test:run'], function() {
    return getTestReport();
});

/*
 * Run API tests
 */
gulp.task('test:api', function () {
    // call newman.run to pass `options` object and wait for callback 
    newman.run({
        collection: require('./postman_collection.json'),
        reporters: 'cli'
    }, function (err) {
        if (err) { console.log(err); }
        console.log('collection run complete!');
    });
});