/**
 *
 * Error management.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

// External librairies
import express = require('express');

// Internal models imports
import { InvalidRequestException } from '../../../model/exception/invalid-request.exception';


export interface IErrorService {

    /**
     * Manage known exception to send specific HTTP error.
     * @param {Any} err Exception or message thrown by application.
     * @param {express.Request} req Http request.
     * @param {express.Response} res Http response.
     * @return {Boolean} The HTTP response has been send.
     */
    manageKnownError(err: any, req: express.Request, res: express.Response): boolean;

    /**
     * Manage known exception to send specific HTTP error.
     * @param {String} ticketId Ticket id.
     * @param {Any} err Exception or message thrown by application.
     * @param {express.Request} req Http request.
     * @param {express.Response} res Http response.
     * @return {Boolean} The HTTP response has been send.
     */
    manageUnknownError(ticketId: string, err: any, req: express.Request, res: express.Response): boolean;

}

export class ErrorService implements IErrorService
{

    manageKnownError(err: any, req: express.Request, res: express.Response): boolean
    {
        let httpResponseSent: boolean = false;
        if (err instanceof InvalidRequestException || err.name === InvalidRequestException.NAME) {
            res.status(400).send(err.message);
            httpResponseSent = true;
        }
        return httpResponseSent;
    }

    manageUnknownError(ticketId: string, err: any, req: express.Request, res: express.Response): boolean
    {
        res.status(500).send(
            {
                ticketId: ticketId
            }
        );
        return true;
    }

}
