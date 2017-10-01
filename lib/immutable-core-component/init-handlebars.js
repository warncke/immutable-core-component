'use strict'

/* npm modules */
const _ = require('lodash')
const defined = require('if-defined')
const handlebars = require('handlebars')

/* exports */
module.exports = initHandlebars

/**
 * @function initHandlebars
 *
 * compile handlebars template, partials and helpers
 *
 * @param {object} args
 *
 * @throws {Error}
 */
function initHandlebars (args) {
    // do not initialize handlebars if no template defined
    if (!defined(args.template)) {
        return
    }
    // require template string
    this.assert(typeof args.template === 'string', 111)
    // create handlebars object that will contain everything needed to
    // render template
    this.handlebars = {
        clientPartials: {},
        serverPartials: {},
        helpers: {},
    }
    // compile main template for client
    this.handlebars.clientTemplate = handlebars.precompile(args.template)
    // compile main template for server
    this.handlebars.serverTemplate = handlebars.compile(args.template)
    // compile any partials
    _.each(args.partials, (partial, name) => {
        // compile partial for client
        this.handlebars.clientPartials[name] = handlebars.precompile(partial)
        // compile partial for server
        this.handlebars.serverPartials[name] = handlebars.compile(partial)
    })
    // add any helpers
    _.each(args.helpers, (helper, name) => {
        // require helper to be function
        this.assert(typeof helper === 'function', 112)
        // add to helpers
        this.handlebars.helpers[name] = helper
    })
}