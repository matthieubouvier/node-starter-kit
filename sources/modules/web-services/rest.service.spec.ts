/**
 *
 * Web services controller unit tests.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// Internal librairies imports
import { LoadModule } from '../../specs/helpers/load-modules/load-modules.service.spec';
import { ExpressMock } from '../../specs/mocks/external/express.mock';

/*
 * Tests for REST service.
 */
describe('Rest service should', () => {

    // Service tested
    var testRestModule;
    var testRestService;
    // Mocks
    var mockExpress;

    /*
     * Tests setup and teardown.
     */
    beforeEach(() => {
        mockExpress = ExpressMock.getExpressMockGeneric();
        testRestModule = LoadModule.loadModule('./modules/web-services/rest.service.js',
            {
                'express': mockExpress
            }
        );
    });

    /*
     * Constructor behaviors.
     */
    it('initialize router', () => {
        // Act
        testRestService = new testRestModule.RestService();

        // Assert
        expect(typeof(testRestService.router)).toBe('object');
    });

});
