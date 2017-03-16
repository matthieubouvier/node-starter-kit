/**************************************************
 * Main file for web server
 **************************************************/
/// <reference path="../typings/references.d.ts" />


/**************************************************
 * Constants
 **************************************************/

// Config file path
const CONFIG_FILE = './app-config.json';


/**************************************************
 * Global variables
 **************************************************/

// Logs
var logService: ILogService;
// Global error management
var errorService: IErrorService;

// Server object provided by express
var server;
// Session middleware to access express sessions
var sessionMiddleware;


/**************************************************
 * Imports
 **************************************************/

// Overide promise management with bluebird for efficiency and domain management (https://github.com/nodejs/node-v0.x-archive/issues/8648)
global.Promise=require('bluebird');
// Web server framework
import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import session = require('express-session');
// Authentication management
import passport = require('passport');
import passportLocal = require('passport-local');
import expressDomainMiddleware = require('express-domain-middleware');

// Internal modules
import { Ioc } from './modules/helpers/dependency-injector/dependency-injector.service';

import { LogService, ILogService } from './modules/helpers/log/log.service';
import { ErrorService, IErrorService } from './modules/helpers/error/error.service';

import { TestRestService } from './modules/web-services/test/test.rest.service';


/**************************************************
 * Functions
 **************************************************/

/**
 * Callback used for reading web server config file.
 * @return {Function} Callback used by jsonfile.readFile
 */
// Callback used for reading web server config file
function initWebServer() {
    return function(err, obj) {
        if(err) {
            console.error(err);
            process.exit(1);
        } else {
            // Configuration read:
            //  - Init logs
            if(obj.log) {
                initLog(obj.log);
            }
            //  - Init services
            initServices(obj);
            // - Launch server !
            launchWebServer();
        }
    };
}

/**
 * Init logs configuration.
 * @param {Object} logConfiguration The log configuration object.
 */
function initLog(logConfiguration: any): void {
    Ioc.registerCustom("ILogService", () => {
        if (process.domain === null)
        {
            return new LogService(logConfiguration);
        }  
        else
        {
            if ((<any>process.domain).logService === undefined)
            {
                (<any>process.domain).logService = new LogService(logConfiguration, (<any>process.domain).id);
            }
            return (<any>process.domain).logService;
        }
    });
    logService = Ioc.getInstance("ILogService");
}

/**
 * Init application services.
 * databaseService has to be initiated before calling.
 */
function initServices(obj:any): void {

    // Main singleton
    errorService = new ErrorService();

    // Injection registration

    logService.info('Services initialized.');
}

/**
 * Init and launch web server.
 */
function launchWebServer(): any {
    sessionMiddleware = session({
        secret: 'TDS-2016',
        resave: false,
        saveUninitialized: false
    });

    // Create and launch web server
    var app = express();
    app.use(bodyParser.urlencoded({ extended: true }))
        .use(bodyParser.json())
        .use(cookieParser())
        .use(sessionMiddleware)
        .use(expressDomainMiddleware)
        .use(passport.initialize())
        .use(passport.session())
        // REST routes
        .use('/api/test', TestRestService.getRouter())
        // Errors handling
        .use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            // Manage known exceptions (invalid request, ...)
            let responseSent: boolean = errorService.manageKnownError(err, req, res);
            // Continue only if the error management has not managed response
            if (!responseSent) {
                next(err);
            }
        })
        .use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            // Manage unknown exceptions
            let currentLogService: ILogService = Ioc.getInstance('ILogService');
            errorService.manageUnknownError(currentLogService.getTicketId(), err, req, res);
            // Continue for logging
            next(err);
        })
        .use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            // Log error with current log service (associated to current request)
            let currentLogService: ILogService = Ioc.getInstance('ILogService');
            currentLogService.error('Last error catched before dump logs=', err);
            currentLogService.dumpSavedLogs();
        });
    var server = app.listen(3002, function () {
        logService.info('TDS web configurator server listening at http://%s:%d', 'localhost', 3002);
    });
    return server;
}


/**************************************************
 * MAIN
 **************************************************/

var jsonfile = require('jsonfile');
jsonfile.readFile(CONFIG_FILE, initWebServer());
