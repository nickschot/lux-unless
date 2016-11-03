Conditionally skip a middleware when a condition is met.

[![Build Status](https://travis-ci.org/nickschot/lux-unless.svg?branch=master)](https://travis-ci.org/nickschot/lux-unless) [![Coverage Status](https://coveralls.io/repos/github/nickschot/lux-unless/badge.svg?branch=master)](https://coveralls.io/github/nickschot/lux-unless?branch=master) [![npm version](https://badge.fury.io/js/lux-unless.svg)](https://badge.fury.io/js/lux-unless)

This is a port of [express-unless](https://github.com/jfromaniello/express-unless) to the [Lux](https://github.com/postlight/lux) API framework.

## Install

	npm i lux-unless --save

## Usage

You can use lux-unless in Lux with a middleware called `myMiddleware` as follows:

```javascript
import unless from 'lux-unless';

class ApplicationController extends Controller {
    beforeAction = [
        unless({path: ['/users/login']}, myMiddleware)
    ];
}
```

## Current options

-  `method` it could be an string or an array of strings. If the request method match the middleware will not run.
-  `path` it could be an string, a regexp or an array of any of those. It also could be an array of object which is url and methods key-pairs. If the request path or path and method match, the middleware will not run. Check [Examples](#examples) for usage.
-  `ext` it could be an string or an array of strings. If the request path ends with one of these extensions the middleware will not run.
-  `custom` it must be a function that accepts `req` and returns `true` / `false`. If the function returns true for the given request, the middleware will not run.


## Examples

Require authentication for every request unless the path is index.html.

```javascript
unless({
  path: [
    '/index.html',
    { url: '/', methods: ['GET', 'PUT']  }
  ]
}, requiresAuth);
```

Avoid a fstat for request to routes which don't end with a given extension.

```javascript
unless(function (req) {
  var ext = url.parse(req.originalUrl).pathname.substr(-4);
  return !~['.jpg', '.html', '.css', '.js'].indexOf(ext);
}, static);
```
