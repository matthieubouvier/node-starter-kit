/**
 * Logs and traces management.
 *      Every logs (info, error, warn and debug) are saved.
 *      Saved logs can be dumped on demand.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// External librairies
import util = require('util');
import winston = require('winston');

/*
 * Log levels
 */
enum LOG_LEVEL {
    error = 0,
    warning,
    info,
    debug
}

/**
 * Saved log class:
 *      Timestamp (timestamp at log creation)
 *      Formatted message
 */
class SavedLog
{
    level: LOG_LEVEL;
    timestamp: Date;
    message: string;

    constructor(level: LOG_LEVEL, message: string)
    {
        this.level = level;
        this.timestamp = new Date();
        this.message = message;
    }

}

export interface ILogService {

    /**
     * Dump logs currently saved.
     */
    dumpSavedLogs();

    /**
     * Get ticket id.
     */
    getTicketId(): string;

    /**
     * Log debug information.
     * @param {String} msg Message to log.
     * @param {Array} meta Parameters used for string interpolation and metadata.
     */
    debug(msg: string, ... meta: any[]);

    /**
     * Log basic information.
     * @param {String} msg Message to log.
     * @param {Array} meta Parameters used for string interpolation and metadata.
     */
    info(msg: string, ... meta: any[]);

    /**
     * Log warning information.
     * @param {String} msg Message to log.
     * @param {Array} meta Parameters used for string interpolation and metadata.
     */
    warning(msg: string, ... meta: any[]);

    /**
     * Log error information.
     * @param {String} msg Message to log.
     * @param {Array} meta Parameters used for string interpolation and metadata.
     */
    error(msg: string, ... meta: any[]);

}

export class LogService implements ILogService
{
    private savedLogs: Array<SavedLog>;
    private currentTicketId: string;
    private static winstonAlreadyConfigured: boolean = false;
    private static classicLogger: winston.LoggerInstance;
    private static errorLogger: winston.LoggerInstance;

    /**
     * Constructor.
     *      Instantiate a classic logger and an error logger for each service instance.
     * @param {Object} logConfiguration The log configuration.
     * @param {String} requestId The request id constructing, and needing, the service.
     */
    constructor(logConfiguration: any, requestId?: string)
    {
        // Saved logs init
        this.savedLogs = new Array<SavedLog>();
        this.currentTicketId = requestId;

        // Log init only on first instance
        // No concurrent access is managed: the first log service is initialized on application start
        if (!LogService.winstonAlreadyConfigured) {
            
            LogService.winstonAlreadyConfigured = true;
            // Remove and add console to take new configuration
            winston.remove(winston.transports.Console);

            if (!logConfiguration) {
                throw new Error('Log configuration service can\'t be null');
            }

            var timeStampFunction = function () {
                var currentDate = new Date();
                var currentDay = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' +  currentDate.getDate();
                var currentHour = currentDate.getHours() + ':' + currentDate.getMinutes() + ':' +  currentDate.getSeconds();
                return '[' + currentDay + ' ' + currentHour + ']';
            };

            var fileOptions = {
                level: logConfiguration.level,
                json: false,
                filename: logConfiguration.filePath,
                timestamp: timeStampFunction
            };
            var consoleOptions = {
                level: logConfiguration.level,
                timestamp: timeStampFunction
            };
            // Create classic logger with console and syslog
            LogService.classicLogger = new (winston.Logger)({
                transports: [
                    new (winston.transports.Console)(consoleOptions),
                    new (winston.transports.File)(fileOptions)
                ]
            });
            LogService.classicLogger.info('Classic logger console initialization done, options:', consoleOptions);
            LogService.classicLogger.info('Classic logger file initialization done, options:', fileOptions);
            // Create specific logger for dump log error
            fileOptions.filename = logConfiguration.errorFilePath;
            LogService.errorLogger = new (winston.Logger)({
                transports: [
                    new (winston.transports.File)(fileOptions)
                ]
            });
            LogService.classicLogger.info('Error logger file initialization done, options:', fileOptions);
        }

    }

    getTicketId(): string {
        return this.currentTicketId ? this.currentTicketId : '';
    }

    dumpSavedLogs()
    {
        // Loop on saved logs
        for (var iLog = 0; iLog < this.savedLogs.length; iLog++) {
            let currentLog: SavedLog = this.savedLogs[iLog];
            let log: string = util.format('[Request=%s] [%s] %s',
                this.currentTicketId ? this.currentTicketId : '',
                currentLog.timestamp.toISOString() ,
                currentLog.message
            );
            switch (currentLog.level) {
                case LOG_LEVEL.error:
                    LogService.errorLogger.error(log);
                    break;
                case LOG_LEVEL.warning:
                    LogService.errorLogger.warn(log);
                    break;
                case LOG_LEVEL.debug:
                    LogService.errorLogger.debug(log);
                    break;
                default:
                    LogService.errorLogger.info(log);
                    break;
            }
        }

        // Reset saved logs
        this.savedLogs = new Array<SavedLog>();
    }

    debug(msg: string, ... meta: any[]) {
        LogService.classicLogger.debug.apply(LogService.classicLogger, [msg].concat(meta));
        this.saveLog.apply(this, [LOG_LEVEL.debug, msg].concat(meta));
    }

    info(msg: string, ... meta: any[]) {
        LogService.classicLogger.info.apply(LogService.classicLogger, [msg].concat(meta));
        this.saveLog.apply(this, [LOG_LEVEL.info, msg].concat(meta));
    }

    warning(msg: string, ... meta: any[]) {
        LogService.classicLogger.warn.apply(LogService.classicLogger, [msg].concat(meta));
        this.saveLog.apply(this, [LOG_LEVEL.warning, msg].concat(meta));
    }

    error(msg: string, ... meta: any[]) {
        LogService.classicLogger.error.apply(LogService.classicLogger, [msg].concat(meta));
        this.saveLog.apply(this, [LOG_LEVEL.error, msg].concat(meta));
    }

    /**
     * Save log.
     * @param {LOG_LEVEL} level Message level to log.
     * @param {String} msg Message to log.
     * @param {Array} meta Parameters used for string interpolation and metadata.
     * @return {ILogService} The log service.
     */
    private saveLog(level: LOG_LEVEL, msg: string, ... meta: any[]) {
        let log: SavedLog = new SavedLog(level, util.format.apply(this, [msg].concat(meta)));
        this.savedLogs.push(log);
    }
}
