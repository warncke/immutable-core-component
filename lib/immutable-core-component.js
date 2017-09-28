'use strict'

/* npm modules */
const ImmutableCore = require('immutable-core')
const ImmutableError = require('immutable-error')
const ImmutableGlobal = require('immutable-global')
const _ = require('lodash')

/* application modules */
const initModule = require('./immutable-core-component/init-module')

// initialize global data
const immutableGlobal = new ImmutableGlobal('ImmutableCoreComponent')
// initialize error generator
const immutableError = new ImmutableError({
    class: 'ImmutableCoreComponent',
    errorCodes: {
        100: 'arguments object required',
        101: 'name must be string',
    },
    nameProperty: 'name',
})

/* exports */
module.exports = ImmutableCoreComponent

/** 
 * @function ImmutableCoreComponent
 *
 * instantiate a new ImmutableCoreComponent
 *
 * @param {object} args
 *
 * @returns {ImmutableCoreComponent}
 *
 * @throws {Error}
 */
function ImmutableCoreComponent (args) {
    // create ImmutableCore module and methods
    this.initModule(args)
}

/* public methods */
ImmutableCoreComponent.prototype = {
    assert: assert,
    global: global,
    initModule: initModule,
    throw: _throw,
    // class properties
    class: 'ImmutableCoreComponent',
    ImmutableCoreComponent: true,
}

/* static methods */
ImmutableCoreComponent.assert = assert
ImmutableCoreComponent.global = global
ImmutableCoreComponent.reset = reset
ImmutableCoreComponent.throw = _throw

/**
 * @function assert
 *
 * assert that value is true - throw error if false
 *
 * @param {boolean} assert
 * @param {number} code
 * @param {string} customMessage
 * @param {Error} original
 * @param {object} data
 *
 * @throws {Error}
 */
function assert (assert, code, customMessage, original, data) {
    return immutableError.assert(assert, this, code, customMessage, original, data)
}

/**
 * @function global
 *
 * return global data
 *
 * @returns {object}
 */
function global () {
    return immutableGlobal.data
}

/**
 * @function reset
 *
 * reset global data
 */
function reset () {
    immutableGlobal.reset()
}

/**
 * @function _throw
 *
 * throw an error
 *
 * @param {number} code
 * @param {string} customMessage
 * @param {Error} original
 * @param {object} data
 *
 * @throws {Error}
 */
function _throw (code, customMessage, original, data) {
    immutableError.throw(this, code, customMessage, original, data)
}