/**
 * Error service unit tests
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// Internal librairies imports
import { LoadModule } from '../../../specs/helpers/load-modules/load-modules.service.spec';
import { ExpressMock } from '../../../specs/mocks/external/express.mock';

// Internal models imports
import { InvalidRequestException } from '../../../model/exception/invalid-request.exception';

/*
 * Tests for log service.
 */
describe('Error service should', () => {

    // Service tested
    var testErrorModule;
    var testErrorService;
    var LOG_LEVEL;
    // Mocks
    var mockExpress;
    var mockRequest;
    var mockResponse;

    /*
     * Tests setup and teardown.
     */
    beforeEach(() => {
        mockExpress = ExpressMock.getExpressMockGeneric();
        testErrorModule = LoadModule.loadModule('./modules/helpers/error/error.service.js',
            {
                'express': mockExpress,
            }
        );
        LOG_LEVEL = testErrorModule.LOG_LEVEL;
        testErrorService = new testErrorModule.exports.ErrorService();
    });

    /*
     * Manage unknown errors.
     */
    describe('have a method to manage unknown errors, which should', () => {

        beforeEach(() => {
            mockRequest = ExpressMock.getRequestMockAuthenticated();
            mockResponse = ExpressMock.getResponseMockGeneric();
        });

        it('send HTTP 500 response with ticket id', () => {
            // Prepare
            let ticketId: string = 'ARandomTicketId';

            // Act
            spyOn(mockResponse, 'status').and.callThrough();
            testErrorService.manageUnknownError(ticketId, {}, mockRequest, mockResponse);

            //Assert
            expect(mockResponse.status).toHaveBeenCalledWith(500);
        });

    });

    /*
     * Manage known errors.
     */
    describe('have a method to manage known errors, which should', () => {

        beforeEach(() => {
            mockRequest = ExpressMock.getRequestMockAuthenticated();
            mockResponse = ExpressMock.getResponseMockGeneric();
        });

        it('send HTTP 400 with error message when InvalidRequestException', () => {
            // Prepare
            let ticketId: string = 'ARandomTicketId';

            // Act
            spyOn(mockResponse, 'status').and.callThrough();
            testErrorService.manageKnownError(new InvalidRequestException(), mockRequest, mockResponse);

            //Assert
            expect(mockResponse.status).toHaveBeenCalledWith(400);
        });

    });

});
