/**
 *
 * Test rest web services unit tests.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// Internal librairies imports
import { LoadModule } from '../../../specs/helpers/load-modules/load-modules.service.spec';
import { ExpressMock } from '../../../specs/mocks/external/express.mock';
import { GenericMock } from '../../../specs/mocks/generic.mock';

/*
 * Tests for database service.
 */
describe('Test REST service should', function() {

    // Service tested
    var testTestRestModule;
    // Mocks
    var mockWinston;
    var mockExpress;
    var mockLoginService;
    // Declared routes
    var declaredRoutes: any;

    /*
     * Tests setup and teardown.
     */
    beforeEach(function() {
        declaredRoutes = {};
        mockWinston = new GenericMock();
        testTestRestModule = LoadModule.loadModule('./modules/web-services/test/test.rest.service.js',
            {
                'express': mockExpress
            }
        );
        testTestRestModule.TestRestService.getRouter();
    });

    /*
     * Functions availability.
     */
    it('have a constructor', function() {
        expect(typeof(testTestRestModule.TestRestService)).toBe('function');
    });

    /*
     * Routes.
     */
    it('initialize route to get Tests list', function() {
        // Assert
        var routeToFind = ExpressMock.routeToString('get');
        expect(declaredRoutes[routeToFind]).toBe(routeToFind);
    });

    it('have only one declared route', function() {
        // Assert
        expect(Object.keys(declaredRoutes).length).toBe(1);
    });

});
