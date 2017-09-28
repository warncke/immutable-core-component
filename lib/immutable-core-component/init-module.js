'use strict'

/* npm modules */
const ImmutableCore = require('immutable-core')

/* exports */
module.exports = initModule

/**
 * @function initModule
 *
 * create ImmutableCore module and methods
 *
 * @param {object} args
 *
 * @throws {Error}
 */
function initModule (args) {
    // require args
    this.assert(typeof args === 'object' && args, 100)
    // require string name
    this.assert(typeof args.name === 'string' && args.name.length, 101)
    // store name
    this.name = args.name
    // create module name from string with `Component` appended
    this.moduleName = `${this.name}Component`
    // create new module - throws error if defined
    this.module = ImmutableCore.module(this.moduleName, {})
}