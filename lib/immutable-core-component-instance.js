'use strict'

/* npm modules */
const ImmutableError = require('immutable-error')
const Promise = require('bluebird')
const _ = require('lodash')
const changeCase = require('change-case')
const defined = require('if-defined')

/* exports */
module.exports = ImmutableCoreComponentInstance

/* globals */

// initialize error generator
const immutableError = new ImmutableError({
    class: 'ImmutableCoreComponentInstance',
    errorCodes: {
        100: 'arguments object required',
        101: 'component required',
        110: 'data must be object',
    },
    nameProperty: 'id',
})

/** 
 * @function ImmutableCoreComponentInstance
 *
 * instantiate a new ImmutableCoreComponentInstance
 *
 * @param {object} args
 *
 * @returns {ImmutableCoreComponentInstance}
 *
 * @throws {Error}
 */
function ImmutableCoreComponentInstance (args) {
    // require args
    this.assert(typeof args === 'object' && args, 100)
    // get component
    var component = args.component
    // require component
    this.assert(typeof component === 'object' && component && component.ImmutableCoreComponent, 101)
    // set component
    this.component = component
    // initialize data to empty object
    this.data = {}
    // if id is passed then initialize existing instance
    if (defined(args.id)) {
        // set id from args
        this.id = args.id
    }
    // otherwise create new instance
    else {
        // set default id which may be overwritten by new
        this.id = this.component.name
        // run new method setting data and id from response
        // this.promise will be resolved by new
        this.initNew(args)
    }
}

/* public methods */
ImmutableCoreComponentInstance.prototype = {
    assert: assert,
    initNew: initNew,
    throw: _throw,
    toString: toString,
    // class properties
    class: 'ImmutableCoreComponentInstance',
    ImmutableCoreComponentInstance: true,
}

/* static methods */
ImmutableCoreComponentInstance.assert = assert
ImmutableCoreComponentInstance.throw = _throw

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
 * @function initNew
 *
 * run component module new method if defined
 *
 * @param {object} args
 */
function initNew (args) {
    // get module
    var module = this.component.module
    // if module has new method run it
    if (module.new) {
        // call new method with original new args
        this.promise = module.new(args.args).then(res => {
            // if new returns undefined do not set
            if (!defined(res)) {
                return
            }
            // require data to be object
            this.assert(typeof res === 'object' && res, 110)
            // if data is set then use it
            if (defined(res.data)) {
                // require data to be object
                this.assert(typeof res.data === 'object' && res.data, 110)
                // set component data to data returned by new method
                this.data = res.data
            }
            // if id set set it data use it
            if (defined(res.id)) {
                this.id = res.id
            }
        })
    }
    // otherwise set resolved promise
    else {
        this.promise = Promise.resolve()
    }
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

/**
 * @function toString
 *
 * render template and package of component assets
 *
 * @returns {string}
 */
function toString () {
    // get handlebars
    var handlebars = this.component.handlebars
    // html for main template to include in page
    var html = ''
    // if there is template render it
    if (handlebars) {
        // get copy of data to add any placeholders
        var data = _.cloneDeep(this.data)
        // add any placeholder data
        _.each(this.component.client.placeholders, (value, property) => {
            if (!defined(_.get(data, property))) {
                _.set(data, property, value)
            }
        })
        // render template
        html = handlebars.serverTemplate(data, {
            helpers: handlebars.helpers,
            partials: handlebars.serverPartials,
        })
    }
    // initialize component with default client configuration
    var client = {
        binds: this.component.client.binds,
        data: this.data,
        id: this.id,
        name: this.component.name,
        refreshInterval: this.component.client.refreshInterval,
        server: this.component.client.server,
    }
    // JSON encode client args
    var clientArgs = JSON.stringify(client, null, this.component.client.minify ? 0 : 4)
    // build script to include with template
    var script = '(function () {\n'
        +`'use strict';\n`
        +`var component = new ImmutableAppComponent(${clientArgs});\n`
    // add hooks if any
    _.each(this.component.client.hooks, (hook, name) => {
        script += `component.${name} = ${hook};\n`
    })
    // add handlebars config
    if (defined(this.component.handlebars)) {
        // add handlebars helpers if any
        _.each(this.component.handlebars.helpers, (helper, name) => {
            script += `component.helpers['${name}'] = ${helper};\n`
        })
        // add handlebars partials if any
        _.each(this.component.handlebars.clientPartials, (partial, name) => {
            script += `component.partials['${name}'] = Handlebars.template(${partial});\n`
        })
        // add template
        script += `component.template = Handlebars.template(${this.component.handlebars.clientTemplate});\n`
    }
    // add js if any
    if (this.component.js) {
        script += this.component.js
    }
    // close anonymous function
    script += '})();'
    // build string to return
    var string = `<div id="${this.id}" class="immutable-app-component-${changeCase.snakeCase(this.component.name)}">${html}</div>\n`
        +`<script>${script}</script>\n`
    // add css if defined
    if (this.component.css.length) {
        string += `<style>${this.component.css}</style>`
    }
    // return string to be included in template
    return string
}