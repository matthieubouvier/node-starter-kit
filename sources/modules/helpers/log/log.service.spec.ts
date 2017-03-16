/**
 * Log service unit tests
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// Internal librairies imports
import { LoadModule } from '../../../specs/helpers/load-modules/load-modules.service.spec';
import { UtilMock } from '../../../specs/mocks/external/util.mock';
import { WinstonMock } from '../../../specs/mocks/external/winston.mock';
import { GenericMock } from '../../../specs/mocks/generic.mock';

/*
 * Tests for log service.
 */
describe('Log service should', () => {

    // Service tested
    var testLogModule;
    var testLogService;
    var LOG_LEVEL;
    // Mocks
    var mockUtil;
    var mockWinston;
    var mockWinstonSyslog;

    /*
     * Tests setup and teardown.
     */
    beforeEach(() => {
        mockUtil = new UtilMock();
        mockWinston = new WinstonMock();
        mockWinstonSyslog = new GenericMock();
        testLogModule = LoadModule.loadModule('./modules/helpers/log/log.service.js',
            {
                'util': mockUtil,
                'winston': mockWinston,
                'winston-syslog': mockWinston
            }
        );
        LOG_LEVEL = testLogModule.LOG_LEVEL;
    });

    /*
     * Get service.
     */
    describe('have a method to get log service, which should', () => {

        it('throw an exception if configuration is not given', () => {
            try {
                testLogModule.exports.LogService();
                expect('LogService exception').toBe('caught');
            } catch (e) {
                expect(e.name).toBe('Error');
                expect(e.message).toBe('Log configuration service can\'t be null');
            }
        });

        it('return an object if request id is not given', () => {
            expect(typeof(new testLogModule.exports.LogService({}))).toBe('object');
        });

        it('return an object if request id is given', () => {
            expect(typeof(new testLogModule.exports.LogService({}, 0))).toBe('object');
        });

    });

    /*
     * Ticket Id.
     */
    describe('have method to get current ticket id, which should', () => {

        it('return empty string if no ticket is defined', () => {
            // Prepare
            testLogService = new testLogModule.exports.LogService({});

            // Act
            let ticket: string = testLogService.getTicketId();

            // Assert
            expect(ticket).toBe('');
        });

        it('return ticket string if ticket is defined', () => {
            // Prepare
            testLogService = new testLogModule.exports.LogService({}, 'ticketId');

            // Act
            let ticket: string = testLogService.getTicketId();

            // Assert
            expect(ticket).toBe('ticketId');
        });

    });


    /*
     * Logs.
     */
    describe('have methods to log, which should', () => {

        beforeEach(() => {
            testLogService = new testLogModule.exports.LogService({}, 0);
            mockWinston.resetCounters();
            testLogModule.LogService.classicLogger.resetCounters();
            testLogModule.LogService.errorLogger.resetCounters();
        });

        it('log info with winston classic logger', () => {
            // Act
            testLogService.info('original info log');

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(1);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
        });

        it('save info log', () => {
            // Act
            testLogService.info('original info log');

            // Assert
            expect(testLogService.savedLogs[0].message).toBe(mockUtil.format());
            expect(LOG_LEVEL[testLogService.savedLogs[0].level]).toBe(LOG_LEVEL[LOG_LEVEL.info]);
        });

        it('log error with winston classic logger', () => {
            // Act
            testLogService.error('original error log');

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(1);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
        });

        it('save error log', () => {
            // Act
            testLogService.error('original error log');

            // Assert
            expect(testLogService.savedLogs[0].message).toBe(mockUtil.format());
            expect(LOG_LEVEL[testLogService.savedLogs[0].level]).toBe(LOG_LEVEL[LOG_LEVEL.error]);
        });

        it('log warning with winston classic logger', () => {
            // Act
            testLogService.warning('original warning log');

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(1);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
        });

        it('save warning log', () => {
            // Act
            testLogService.warning('original warning log');

            // Assert
            expect(testLogService.savedLogs[0].message).toBe(mockUtil.format());
            expect(LOG_LEVEL[testLogService.savedLogs[0].level]).toBe(LOG_LEVEL[LOG_LEVEL.warning]);
        });

        it('log debug with winston classic logger', () => {
            // Act
            testLogService.debug('original debug log');

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(1);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
        });

        it('save debug log', () => {
            // Act
            testLogService.debug('original debug log');

            // Assert
            expect(testLogService.savedLogs[0].message).toBe(mockUtil.format());
            expect(LOG_LEVEL[testLogService.savedLogs[0].level]).toBe(LOG_LEVEL[LOG_LEVEL.debug]);
        });

    });

    /*
     * Dump saved logs.
     */
    describe('have a method to dump saved log, which should', () => {

        beforeEach(() => {
            testLogService = new testLogModule.exports.LogService({}, 0);
            mockWinston.resetCounters();
            mockWinston.resetCounters();
            testLogModule.LogService.classicLogger.resetCounters();
            testLogModule.LogService.errorLogger.resetCounters();
        });

        it('log saved info log', () => {
            // Prepare
            testLogService.info('original info log');

            // Act
            testLogService.dumpSavedLogs();

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(1);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(1);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
            expect(testLogService.savedLogs.length).toBe(0);
        });

        it('log saved error log', () => {
            // Prepare
            testLogService.error('original error log');

            // Act
            testLogService.dumpSavedLogs();

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(1);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(1);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
            expect(testLogService.savedLogs.length).toBe(0);
        });

        it('log saved warning log', () => {
            // Prepare
            testLogService.warning('original warning log');

            // Act
            testLogService.dumpSavedLogs();

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(1);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(1);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(0);
            expect(testLogService.savedLogs.length).toBe(0);
        });

        it('log saved debug log', () => {
            // Prepare
            testLogService.debug('original debug log');

            // Act
            testLogService.dumpSavedLogs();

            // Assert
            expect(testLogModule.LogService.classicLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.classicLogger.debugCalls).toBe(1);
            expect(testLogModule.LogService.errorLogger.infoCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.warnCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.errorCalls).toBe(0);
            expect(testLogModule.LogService.errorLogger.debugCalls).toBe(1);
            expect(testLogService.savedLogs.length).toBe(0);
        });

    });

});
