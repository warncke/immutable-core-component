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

## Server configuration options

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

The arguments for `server` will be taken from the `foo.server.js` file when used
with Immutable App Component.

## Client configuration options

    var component = new ImmutableCoreComponent({
        client: {
            binds: { 'element-id', 'data.property' },
            minify: true,
            placeholders: { foo: 'foo', 'foo.bar', 'bar' },
            preRender: function (args) { .... }
        }
    })

The arguments for `client` will be taken from the `foo.client.js` file when used
with Immutable App Component.

| name              | type      | description                                  |
|-------------------|-----------|----------------------------------------------|
| binds             | object    | map of ids and data properties to bind       |
| minify            | boolean   | minify js sent to client                     |
| placeholders      | object    | map of data properties and placeholder values|
| refreshInterval   | integer   | time in ms between refresh of client data    |
|-------------------|-----------|----------------------------------------------|
| preBind           | function  | hook that executes before bind               |
| preGet            | function  | hook that executes before get                |
| preRefresh        | function  | hook that executes before refresh            |
| preRender         | function  | hook that executes before render             |
| preSet            | function  | hook that executes before set                |
| postBind          | function  | hook that executes after bind                |
| postGet           | function  | hook that executes after get                 |
| postRefresh       | function  | hook that executes after refresh             |
| postRender        | function  | hook that executes after render              |
| postSet           | function  | hook that executes after set                 |


## General configuration options

    var component = new ImmutableCoreComponent({
        css: '.foo { display: block }',
        helpers: { bar: function () {...} },
        js: 'console.log("foo")',
        partials: { bam: 'Goodbye {{foo}}' },
        template: 'Hello {{foo}}',
    })

When using Immutable App Component:

* the `css` property comes from `foo.css`
* the `helpers` object is populated from the `helpers` directory
* the `js` property comes from `foo.js`
* the `partials` object is populated from the `partials` directory
* the `template` property comes from `foo.hbs`

| name      | type      | description                                          |
|-----------|-----------|------------------------------------------------------|
| css       | string    | css to include on page - will be wrapped in <style>  |
| helpers   | object    | map of handlebars helper names and functions         |
| js        | string    | js to include - will be wrapped in anonymous function|
| partials  | object    | map of hadlebars partials names and template strings |
| template  | string    | main handlebars template string                      |