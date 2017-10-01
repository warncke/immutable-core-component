'use strict'

/* npm modules */
const _ = require('lodash')
const defined = require('if-defined')

/* exports */
module.exports = initClient

/* globals */

// list of valid hook names
const hookNames = {
    preBind: true,
    preGet: true,
    preRefresh: true,
    preRender: true,
    preSet: true,
    postBind: true,
    postGet: true,
    postRefresh: true,
    postRender: true,
    postSet: true,
}

// list of client options
const clientOptions = [
    'minify'
]

/**
 * @function initClient
 *
 * initialize client component
 *
 * @param {object} args
 *
 * @throws {Error}
 */
function initClient (args) {
    // create client configuration
    this.client = {
        binds: [],
        hooks: {},
        minify: false,
        refreshInterval: 0,
        server: {
            hasGet: defined(this.module.get),
            hasSet: defined(this.module.set),
        }
    }
    // skip if client args not set
    if (!defined(args.client)) {
        return
    }
    // add any hooks
    _.each(args.client.hooks, (hook, name) => {
        // require function
        this.assert(typeof hook === 'function', 115)
        // require valid hook
        this.assert(hookNames[name], 116, `${name} is not a valid hook name`)
        // set hook
        this.client.hooks[name] = hook
    })
    // set refresh interval if defined
    if (defined(args.client.refreshInterval)) {
        // convert to integer
        var refreshInterval = parseInt(args.client.refreshInterval)
        // require positive integer
        this.assert(refreshInterval > 0, 117)
        // set refresh interval
        this.client.refreshInterval = refreshInterval
    }
    // set binds if defined
    if (defined(args.client.binds)) {
        // require object, can be array
        this.assert(args.client.binds && typeof args.client.binds === 'object', 118)
        // store binds
        this.client.binds = args.client.binds
    }
    // set any client boolean options
    _.each(clientOptions, option => {
        if (defined(args.client[option])) {
            this.client[option] = !!args.client[option]
        }
    })
}