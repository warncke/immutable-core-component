'use strict'

/* npm modules */
const ImmutableCore = require('immutable-core')
const Promise = require('bluebird')
const chai = require('chai')

/* application modules */
const ImmutableCoreComponent = require('../lib/immutable-core-component')

/* chai config */
const assert = chai.assert

describe('immutable-core-component', function () {

    it('should instantiate new component', function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
            server: {
                get: function (args) {},
                new: function (args) {},
                set: function (args) {},
            },
        })
        // should create module
        var module = ImmutableCore.module('fooComponent')
        // module should have methods
        assert.isFunction(module.get)
        assert.isFunction(module.new)
        assert.isFunction(module.set)
    })

})