/**
 *
 * Service for test REST webservice.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// External librairies imports
import express = require('express');

// Internal model
import { InvalidRequestException } from '../../../model/exception/invalid-request.exception';

// Internal librairies imports
import { RestService } from '../rest.service';
import { ILogService } from '../../helpers/log/log.service';
import { inject } from '../../../decorators/inject';

@inject('ILogService')
export class TestRestService extends RestService{

    /**
     * Constructor
     * @param {ILogService} _logService - The log service (DI)
     */
    constructor(private _logService: ILogService) {
        super();
    }

    static getRouter(): express.Router {

        let router: express.Router = express.Router();

        // Get
        router.get('',
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
                this.executeWithInjection(req, res, next, TestRestService, TestRestService.prototype.getTest);
            }
        );

        // Post
        router.post('',
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
                this.executeWithInjection(req, res, next, TestRestService, TestRestService.prototype.postTest);
            }
        );

        // Put
        router.put('',
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
                this.executeWithInjection(req, res, next, TestRestService, TestRestService.prototype.putTest);
            }
        );

        // Delete
        router.delete('',
            (req: express.Request, res: express.Response, next: express.NextFunction) => {
                this.executeWithInjection(req, res, next, TestRestService, TestRestService.prototype.deleteTest);
            }
        );

        return router;

    }

    private getTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this._logService.debug('Enter test.rest.service.getTest');
        res.json('get OK');

    }

    private postTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this._logService.debug('Enter test.rest.service.postTest');
        res.json('post OK');

    }

    private putTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this._logService.debug('Enter test.rest.service.putTest');
        res.json('put OK');

    }

    private deleteTest(req: express.Request, res: express.Response, next: express.NextFunction) {

        this._logService.debug('Enter test.rest.service.deleteTest');
        res.json('delete OK');

    }

}
