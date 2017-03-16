/**
 * Passport mock
 *
 * 17-Jun-16: [MBR] Creation
 */

export class PassportMock {
    /*
     * Static method to get generic passport mock.
     */
    static getPassportMockGeneric() {
        return {
            authenticate: function() {
                return function() {}
            }
        };
    }
}