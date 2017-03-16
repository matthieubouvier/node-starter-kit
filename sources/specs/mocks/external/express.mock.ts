/**
 * Express server mock
 *
 * 17-Jun-16: [MBR] Creation
 */

export class ExpressMock {
    /*
     * Static method to get generic express mock.
     * @param {Object?} routes Modified object containing declared routes
     *      For example:
     *          routes['get/user'] = 'get/user'
     * @return {Object} express mock
     */
    static getExpressMockGeneric(routes?: Object) {
        routes = routes || {};
        return {
            Router: function() {
                return {
                    use: function (arg1: any, arg2: any) {   
                    },
                    post: function(route: string, authentication: any, callback: Function) {
                        var stringRoute = ExpressMock.routeToString('post', route);
                        routes[stringRoute] = stringRoute;
                    },
                    put: function(route: string, authentication: any, callback: Function) {
                        var stringRoute = ExpressMock.routeToString('put', route);
                        routes[stringRoute] = stringRoute;
                    },
                    get: function(route: string, callback: Function) {
                        var stringRoute = ExpressMock.routeToString('get', route);
                        routes[stringRoute] = stringRoute;
                    },
                    delete: function(route: string, callback: Function) {
                        var stringRoute = ExpressMock.routeToString('delete', route);
                        routes[stringRoute] = stringRoute;
                    }
                };
            }
        };
    }

    /*
     * Static method to get Request mock with authentication success.
     * @return {Object} express.Request mock.
     */
    static getRequestMockAuthenticated() {
        return {
            isAuthenticated: () => { return true }
        };
    }

    /*
     * Static method to get Request mock with authentication failure.
     * @return {Object} express.Request mock.
     */
    static getRequestMockNotAuthenticated() {
        return {
            isAuthenticated: () => { return false }
        };
    }

    /*
     * Static method to get Response generic mock.
     * @return {Object} express.Response mock.
     */
    static getResponseMockGeneric() {
        return {
            sendStatus: (errorCode: number) => {},
            status: (code: number) => {
                return {
                    send: (response: any) => {}
                };
            }
        };
    }

    /*
     * Static method to get Next fake mock to spy next method.
     * @return {Object} mock with next function.
     */
    static getNextMockGeneric() {
        return {
            next: () => {}
        };
    }

    /*
     * Static method to construct complete route from HTTP method and URL.
     * @param {String} httpRequest HTTP request method (get, post, put, delete, ...)
     * @param {?String} route URL for REST resource
     * @return {String} concatenated HTTP method and URL
     */
    static routeToString(httpMethod: string, route?: string) {
        route = route || '';
        return httpMethod + route;
    }
}