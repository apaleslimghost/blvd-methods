<h1 align="center">
  blvd-methods
</h1>

Combinators to wrap HTTP handlers and filter based on method.

```javascript
http.createServer(methods.put(function(req, res) {
  assert(req.method === 'put');
}));
```

Supports [every method that Node HTTP does](https://github.com/jshttp/methods).

## Custom method getting

If you're using something other than Node HTTP, and `req` isn't the first argument to the handler, or the method is somewhere other than `req.method`, you can override `getMethod` using underscored methods:

```javascript
var get = methods.get_(function getMethod() {
  return this.method; // e.g. Koa
});

get(function *(next) {
  // ...
});
```

Or override them all at once with `withGetMethod`:

```javascript
var methods = require('blvd-methods').withGetMethod(function getMethod() {
  return this.method; // e.g. Koa
});

methods.get(function *(next) {
  // ...
});
```

## Routing
`blvd-methods` is designed to work well with [Boulevard](https://github.com/quarterto/Boulevard) routers:

```javascript
route([
  ['/',  methods.get(function(req, res) { /* ... */})],
  ['/', methods.post(function(req, res) { /* ... */})],
]);
```

## Licence

MIT.