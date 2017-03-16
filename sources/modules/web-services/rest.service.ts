/**
 *
 * Generic service for all REST webservice services.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// External librairies imports
import express = require('express');
// Internal modules
import { Ioc } from '../helpers/dependency-injector/dependency-injector.service';

export class RestService {

    router: express.Router;

    constructor() {
        this.router = express.Router();
    }

    /**
     * Create an instance of 'type' with dependency injection,
     * and execute function fn to deal with request and response
     * @req {Request} The express request to handle
     * @res {Reponse} The express response to fill
     * @type Type fro mwhich an instance will be created
     * @fn A function to be execeuted in the context of the newly created instance
     **/
    static executeWithInjection(req: express.Request, res: express.Response, next: express.NextFunction, type: any, fn: Function)
    {
        let obj:any=Ioc.getInstance(type);
        fn.apply(obj,[req, res, next]);
    }

}
