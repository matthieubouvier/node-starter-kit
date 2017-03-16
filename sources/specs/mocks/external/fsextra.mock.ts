/**
 * FS extra mock.
 *
 * 2016-09-02: [MBR] Creation.
 */

export class FsExtraMock {

    static defaultVersion: string = 'defaultVersion';

    /*
     * Static method to get generic mock.
     * @return {Object} express.Response mock.
     */
    static getMockGeneric() {
        return {
            readFile: (filepath, fileMode, cb) => {cb(undefined, FsExtraMock.defaultVersion)}
        };
    }
}