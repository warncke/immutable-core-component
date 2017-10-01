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
    this.js = ''
    // if client has css use it
    if (defined(args.css)) {
        // require css to be a string
        this.assert(typeof args.css === 'string', 117)
        // set component css
        this.css = args.css
    }
    // if client has js set use it
    if (defined(args.js)) {
        // require js to be string
        this.assert(typeof args.js === 'string', 114)
        // set component js
        this.js = args.js
    }
}