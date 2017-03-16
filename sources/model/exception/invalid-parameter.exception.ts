/**
 *
 * Invalid parameter exception class.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

import { GenericException } from './generic.exception';

export class InvalidParameterException extends GenericException {

    static NAME = 'InvalidParameterException';

    constructor(message?: string) {
        super(message);
        this.message = message;
        this.name = InvalidParameterException.NAME;
    }

}
