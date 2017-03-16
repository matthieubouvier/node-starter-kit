/**
 * Generic mock
 *
 * 17-Jun-16: [MBR] Creation
 * 28-Jul-16: [MBR] Transform to an empty class which can be completed with addProperty method
 *
 */

export class GenericMock {

    /*
     * Add property to the class prototype.
     * @param {string} name Property name.
     * @param {Any} property Property value (function, string, ...).
     */
    addProperty(name: string, property: any) {
        GenericMock.prototype[name] = property;
    }

}