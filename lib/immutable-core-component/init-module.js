'use strict'

/* npm modules */
const ImmutableCore = require('immutable-core')
const defined = require('if-defined')

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
    // require string name
    this.assert(typeof args.name === 'string' && args.name.length, 101)
    // component must not already be defined
    this.assert(!defined(this.global().components[args.name]), 102, `${args.name} component already defined`)
    // store name
    this.name = args.name
    // create module name from string with `Component` appended
    this.moduleName = `${this.name}Component`
    // create new module - throws error if defined
    this.module = ImmutableCore.module(this.moduleName, {})
    // add info to module meta
    this.module.meta.class = 'ImmutableCoreComponent'
    this.module.meta.instance = this
    // add component to global register
    this.global().components[this.name] = this
}