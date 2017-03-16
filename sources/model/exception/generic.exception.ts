/**
 *
 * Generic exception class.
 *
 * 2017-03-16: [MBR] Creation.
 *
 */

export class GenericException extends Error {

    constructor(message?: string) {
        super(message);
        this.name = 'GenericException';
    }

}
