'use strict'

/* npm modules */
const defined = require('if-defined')

/* exports */
module.exports = initAssets

/**
 * @function initAssets
 *
 * initialize javascript and css assets
 *
 * @param {object} args
 *
 * @throws {Error}
 */
function initAssets (args) {
    // default to empty strings
    this.css = ''
    this.script = ''
    // if client has css use it
    if (defined(args.css)) {
        // require css to be a string
        this.assert(typeof args.css === 'string', 117)
        // set component script
        this.css = args.css
    }
    // if client has script set use it
    if (defined(args.script)) {
        // require script to be string
        this.assert(typeof args.script === 'string', 114)
        // set component script
        this.script = args.script
    }
}