'use strict'

/* npm modules */
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
                new: () => {},
            },
        })
    })

})