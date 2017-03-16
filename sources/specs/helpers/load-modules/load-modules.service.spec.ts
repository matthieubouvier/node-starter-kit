/**
 *
 * Module loader to override require
 * - load module with mocked dependencies
 * - allow accessing private state of the module
 * Code inspired with https://howtonode.org/testing-private-state-and-mocking-deps
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

import vm = require('vm');
import fs = require('fs');
import path = require('path');


export class LoadModule {
    /*
     * Static method to load module
     * @param {string} filePath Absolute path to module (file to load)
     * @param {Object=} mocks Hash of mocked dependencies
     */
    static loadModule(filePath: string, mocks?: any) {

        // Folders
        var pathToProjectRoot = '../../../..';
        var pathToTempFolder = '.tmpTests';

        mocks = mocks || {};

        /* Function to get absolute path for module required in main module
         * requiring ./some inside file /a/b.js needs to be resolved to /a/some
         *  @param {String} relativePath Path from the sources base folder to the module with the js extension
         *  @return {String} Absolute path to the compiled module (in the temp folder)
         */
        var resolveModule = function(module) {
            if (module.charAt(0) !== '.') return module;
            return path.resolve(path.dirname(resolvePath(filePath)), module);
        };

        /* Function to get absolute path for module to load
         * requiring ./some inside file leads to load the module ./some.js (if no mock)
         * requiring some inside file leads to require the module (if no mock)
         *  @param {String} relativePath Path from the sources base folder to the module with the js extension
         *  @return {String} Absolute path to the compiled module (in the temp folder)
         */
        var resolvePath = function(relativePath) {
            return path.resolve(__dirname, pathToProjectRoot, pathToTempFolder, relativePath);
        };

        var exports = {};
        var context = {
            require: function(name) {
                if (name.charAt(0) !== '.') return mocks[name] || require(resolveModule(name));
                return mocks[name] || LoadModule.loadModule(resolveModule(name + '.js'), mocks);
            },
            console: console,
            exports: exports,
            module: {
                exports: exports
            }
        };

        vm.runInNewContext(fs.readFileSync(resolvePath(filePath)).toString(), context,resolvePath(filePath));
        return context;
    }

}