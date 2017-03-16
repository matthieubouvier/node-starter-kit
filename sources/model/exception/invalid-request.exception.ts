/**
 *
 * Invalid request exception class.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

import { GenericException } from './generic.exception';

export class InvalidRequestException extends GenericException {

    static NAME = 'InvalidRequestException';

    constructor(message?: string) {
        super(message);
        this.message = message;
        this.name = InvalidRequestException.NAME;
    }

}
