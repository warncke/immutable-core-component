'use strict'

/* npm modules */
const defined = require('if-defined')
const requireValidOptionalObject = require('immutable-require-valid-optional-object')

/* globals */

// list of module methods
const moduleMethods = ['get', 'new', 'set']

/* exports */
module.exports = initServer

/**
 * @function initServer
 *
 * initialize server component
 *
 * @param {object} args
 *
 * @throws {Error}
 */
function initServer (args) {
    // get server args
    var server = requireValidOptionalObject(args.server)
    // create module methods
    moduleMethods.forEach(methodName => {
        var method = server[methodName]
        // skip if no method in args
        if (!defined(method)) {
            return
        }
        // require function
        this.assert(typeof method === 'function', 110, `${methodName} method must be function`)
        // create module method
        this.module.method(methodName, method)
    })
}