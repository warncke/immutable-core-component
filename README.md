# immutable-core-component

Immutable Core Component provides the server side functionality for
[Immutable App Component](https://www.npmjs.com/package/immutable-app-component).
Together they provide a framework for dynamic UI components that integrate
with the [Immutable App](https://www.npmjs.com/package/immutable-app)
ecosystem.

When using Immutable App, Immutable Core Components will be instantiated
automatically from the files in the component directory. The examples here use
Immutable Core Component directly. See the Immutable App Component documentation
for usage examples with an app.

## Instantiatings a new ImmutableCoreComponent

    var component = new ImmutableCoreComponent({
        name: 'foo',
        server: {
            get: function (args) {}
            new: function (args) {},
            set: function (args) {},
        },
    })

This example will create a new
[Immutable Core](https://www.npmjs.com/package/immutable-core) module named
`fooComponent` with `get`, `new` and `set` methods.

The arguments to `server` will be take from the `foo.server.js` file when used
with Immutable App Component.