'use strict'

/* npm modules */
const ImmutableAI = require('immutable-ai')
const ImmutableCore = require('immutable-core')
const ImmutableError = require('immutable-error')
const ImmutableGlobal = require('immutable-global')
const _ = require('lodash')
const defined = require('if-defined')

/* application modules */
const ImmutableCoreComponentInstance = require('./immutable-core-component-instance')
const initAssets = require('./immutable-core-component/init-assets')
const initClient = require('./immutable-core-component/init-client')
const initHandlebars = require('./immutable-core-component/init-handlebars')
const initModule = require('./immutable-core-component/init-module')
const initServer = require('./immutable-core-component/init-server')

/* exports */
module.exports = ImmutableCoreComponent

// initialize ImmutableAI with ImmutableCoreComponent instance
ImmutableAI.immutableCoreComponent(ImmutableCoreComponent)

/* globals */

// initialize global data
const immutableGlobal = new ImmutableGlobal('ImmutableCoreComponent', {
    components: {},
})
// initialize error generator
const immutableError = new ImmutableError({
    class: 'ImmutableCoreComponent',
    errorCodes: {
        100: 'arguments object required',
        101: 'name must be string',
        102: 'component already defined',
        103: 'component not defined',
        110: 'method must be function',
        111: 'template must be string',
        112: 'helper must be function',
        113: 'client must be object',
        114: 'client script must be string',
        115: 'hook must be function',
        116: 'invalid hook name',
        117: 'client css must be string',
    },
    nameProperty: 'name',
})

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
    // require args
    this.assert(typeof args === 'object' && args, 100)
    // create ImmutableCore module and methods
    this.initModule(args)
    // initialize server component
    this.initServer(args)
    // initialize client component
    this.initClient(args)
    // initialize js and css assets
    this.initAssets(args)
    // initialize handlebars helpers, partials and template
    this.initHandlebars(args)
}

/* public methods */
ImmutableCoreComponent.prototype = {
    assert: assert,
    global: global,
    initAssets: initAssets,
    initClient: initClient,
    initHandlebars: initHandlebars,
    initModule: initModule,
    initServer: initServer,
    new: _new,
    throw: _throw,
    // class properties
    class: 'ImmutableCoreComponent',
    ImmutableCoreComponent: true,
}

/* static methods */
ImmutableCoreComponent.assert = assert
ImmutableCoreComponent.component = getComponent
ImmutableCoreComponent.hasComponent = hasComponent
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
 * @function getComponent
 *
 * get component by name - throws error if not defined
 *
 * @param {string} name
 *
 * @returns {ImmutableCoreComponent}
 *
 * @throws {Error}
 */
function getComponent (name) {
    // get component
    var component = global().components[name]
    // throw error if note defined
    this.assert(defined(component), 103, `${name} component not defined`)
    // return component
    return component
}

/**
 * @function hasComponent
 *
 * return true if component defined
 *
 * @param {string} name
 *
 * @returns {boolean}
 */
function hasComponent (name) {
    // get component
    var component = global().components[name]
    // return true if component is defined
    return defined(component)
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
 * @function _new
 *
 * create new ImmutableCoreComponentInstance
 *
 * @param {object} args
 *
 * @returns {Promise<ImmutableCoreComponentInstance>}
 */
function _new (args) {
    // instantiate new instance
    var instance = new ImmutableCoreComponentInstance({
        args: args,
        component: this,
    })
    // wait for initialize promise to resolve then resolve with instance
    return instance.promise.then(() => instance)
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