'use strict'

/* npm modules */
const ImmutableCore = require('immutable-core')
const ImmutableGlobal = require('immutable-global')
const Promise = require('bluebird')
const chai = require('chai')
const handlebars = require('handlebars')
const sinon = require('sinon')

/* application modules */
const ImmutableCoreComponent = require('../lib/immutable-core-component')

/* chai config */
const assert = chai.assert
sinon.assert.expose(chai.assert, { prefix: '' })

describe('immutable-core-component-instance toString', function () {

    var sandbox

    var newStub

    beforeEach(function () {
        // reset global data
        ImmutableCore.reset()
        ImmutableCoreComponent.reset()
        // create sinon sandbox
        sandbox = sinon.createSandbox()
        // create stub for new method
        newStub = sandbox.stub().resolves({data: {foo: 'bar'}})
    })

    afterEach(function () {
        // clear sinon sandbox
        sandbox.restore()
    })

    it('should render template with toString', async function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
            server: {new: newStub},
            template: 'Hello {{foo}}',
        })
        // create new component instance
        var instance = await component.new({session: {}})
        // check that render includes template
        assert.match(instance.toString(), '<div id="foo" class="immutable-app-component-foo">Hello bar</div>')
    })

    it('should render template with placeholder', async function () {
        var component = new ImmutableCoreComponent({
            client: {
                placeholders: {
                    foo: 'bar',
                },
            },
            name: 'foo',
            template: 'Hello {{foo}}',
        })
        // create new component instance
        var instance = await component.new({session: {}})
        // check that render includes template
        assert.match(instance.toString(), '<div id="foo" class="immutable-app-component-foo">Hello bar</div>')
    })

    it('should render template with partial', async function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
            partials: {bar: 'bam'},
            server: {new: newStub},
            template: 'Hello {{foo}} {{>bar}}',
        })
        // create new component instance
        var instance = await component.new({session: {}})
        // check that render includes template
        assert.match(instance.toString(), '<div id="foo" class="immutable-app-component-foo">Hello bar bam</div>')
    })

    it('should render template with helper', async function () {
        var component = new ImmutableCoreComponent({
            name: 'foo',
            helpers: {bar: () => 'bam'},
            server: {new: newStub},
            template: 'Hello {{foo}} {{bar}}',
        })
        // create new component instance
        var instance = await component.new({session: {}})
        // check that render includes template
        assert.match(instance.toString(), '<div id="foo" class="immutable-app-component-foo">Hello bar bam</div>')
    })

    it('should set default refreshInterval', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            client: {minify: true},
            name: 'foo',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), '"refreshInterval":0')
    })

    it('should set refreshInterval', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            client: {minify: true, refreshInterval: 1000},
            name: 'foo',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), '"refreshInterval":1000')
    })

    it('should set server hasGet/hasSet false', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            client: {minify: true},
            name: 'foo',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), '"server":{"hasGet":false,"hasSet":false}')
    })

    it('should set server hasGet/hasSet false', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            client: {minify: true},
            name: 'foo',
            server: {
                get: () => {},
                set: () => {},
            },
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), '"server":{"hasGet":true,"hasSet":true}')
    })

    const hookNames = [
        'preBind',
        'preGet',
        'preRefresh',
        'preRender',
        'preSet',
        'postBind',
        'postGet',
        'postRefresh',
        'postRender',
        'postSet',
    ]

    hookNames.forEach(hookName => {
        it(`should set ${hookName} hook`, async function () {
            // create new component
            var component = new ImmutableCoreComponent({
                client: {
                    hooks: {
                        [hookName]: function () {return false}
                    },
                },
                name: 'foo',
            })
            // create new instance
            var instance = await component.new({session: {}})
            // render
            assert.match(instance.toString(), `component.${hookName} = function () {return false};`)
        })
    })

    it('should register helpers', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            helpers: {
                foo: function () {return 'foo'}
            },
            name: 'foo',
            template: 'Hello {{foo}}',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), `component.helpers['foo'] = function () {return 'foo'};`)
    })

    it('should register partials', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            name: 'foo',
            partials: {bar: 'bam'},
            template: 'Hello {{foo}}',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), `component.partials['bar'] = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function`)
    })

    it('should set template', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            name: 'foo',
            template: 'Hello {{foo}}',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), `component.template = Handlebars.template({"compiler":[8,">= 4.3.0"],"main":function`)
    })

    it('should set css', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            css: '.foo {font-size: 1px}',
            name: 'foo',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), `<style>.foo {font-size: 1px}</style>`)
    })

    it('should set js', async function () {
        // create new component
        var component = new ImmutableCoreComponent({
            js: 'alert("foo")',
            name: 'foo',
        })
        // create new instance
        var instance = await component.new({session: {}})
        // render
        assert.match(instance.toString(), `alert("foo")`)
    })

})