'use strict'

/* npm modules */
const ImmutableCore = require('immutable-core')
const ImmutableGlobal = require('immutable-global')
const Promise = require('bluebird')
const chai = require('chai')
const sinon = require('sinon')

/* application modules */
const ImmutableCoreComponent = require('../lib/immutable-core-component')

/* chai config */
const assert = chai.assert
sinon.assert.expose(chai.assert, { prefix: '' })

describe('immutable-core-component', function () {

    var sandbox

    beforeEach(function () {
        // reset global data
        ImmutableCore.reset()
        ImmutableCoreComponent.reset()
        // create sinon sandbox
        sandbox = sinon.sandbox.create()
    })

    afterEach(function () {
        // clear sinon sandbox
        sandbox.restore()
    })

    it('should instantiate new component', function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
            server: {
                get: function (args) {},
                new: function (args) {},
                set: function (args) {},
            },
        })
        // check properties
        assert.strictEqual(component.ImmutableCoreComponent, true)
        assert.strictEqual(component.class, 'ImmutableCoreComponent')
        // should create module
        var module = ImmutableCore.module('fooComponent')
        // validate module
        assert.strictEqual(module.meta.class, 'ImmutableCoreComponent')
        // module should have methods
        assert.isFunction(module.get)
        assert.isFunction(module.new)
        assert.isFunction(module.set)
    })

    it('should get component', function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
        })
        // get component
        assert.deepEqual(component, ImmutableCoreComponent.component('foo'))
    })

    it('should check if component defined', function () {
        // check false
        assert.isFalse(ImmutableCoreComponent.hasComponent('foo'))
        // create component
        var component = new ImmutableCoreComponent({
            name: 'foo',
        })
        // check true
        assert.isTrue(ImmutableCoreComponent.hasComponent('foo'))
    })

    it('should throw error getting component that is not defined', function () {
        assert.throws(() => {
            ImmutableCoreComponent.component('foo')
        }, 'foo component not defined')
    })

    it('should instantiate new component instance', async function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
        })
        // create new instance
        var instance = await component.new()
        // check properties
        assert.strictEqual(instance.ImmutableCoreComponentInstance, true)
        assert.strictEqual(instance.class, 'ImmutableCoreComponentInstance')
    })

    it('should call new method when creating new instance', async function () {
        // create stub for new
        var newStub = sandbox.stub().resolves()
        // create new component
        var component = new ImmutableCoreComponent({
            name: 'foo',
            server: {
                new: newStub,
            },
        })
        // create new instance
        var instance = await component.new({
            foo: true,
            session: {},
        })
        // check that stub called
        assert.calledOnce(newStub)
        assert.calledWithMatch(newStub, {foo: true})
    })

    it('should set instance data and id from new return value', async function () {
        // create stub for new
        var newStub = sandbox.stub().resolves({
            data: {foo: true},
            id: 'foo',
        })
        // create new component
        var component = new ImmutableCoreComponent({
            name: 'foo',
            server: {
                new: newStub,
            },
        })
        // create new instance
        var instance = await component.new({
            foo: true,
            session: {},
        })
        // check instance
        assert.deepEqual(instance.data, {foo: true})
        assert.strictEqual(instance.id, 'foo')
    })

    it('should use component name for default id', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            name: 'foo',
        })
        // create new instance
        var instance = await component.new({
            foo: true,
            session: {},
        })
        // check id
        assert.strictEqual(instance.id, 'foo')
    })

})