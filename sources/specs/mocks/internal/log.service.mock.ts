/**
 * Log service mock
 *
 * 04-Aug-16: [MBR] Creation.
 *
 */

import { GenericMock } from '../generic.mock';

export class LogServiceMock extends GenericMock {

    constructor() {
        super();
        this.addProperty('debug', () => {});
        this.addProperty('info', () => {});
        this.addProperty('error', () => {});
        this.addProperty('warning', () => {});
        this.addProperty('dumpSavedLogs', () => {});
    }

}