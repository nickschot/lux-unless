var unless = require('../dist/lux-unless').default;
var assert = require('chai').assert;
var parseURL = require('url').parse;

function getUrl(url){
  var urlObj = parseURL(url, true);
  urlObj.params = [];
  return urlObj;
}

function testMiddleware (req, res) {
  req.called = true;
}

describe('express-unless', function () {

  describe('with PATH(with method) exception', function () {
    var mid = unless({
      path: [
        {
          url: '/test',
          methods: ['POST', 'GET']
        },
        {
          url: '/bar',
          methods: ['PUT']
        },
        '/foo'
      ]
    }, testMiddleware);

    it('should not call the middleware when path and method match', function () {
      var req = {
        url: getUrl('/test?das=123'),
        method: 'POST'
      };

      mid(req, {});
      assert.notOk(req.called);


      req = {
        url: getUrl('/test?test=123'),
        method: 'GET'
      };

      mid(req, {});
      assert.notOk(req.called);

      req = {
        url: getUrl('/bar?test=123'),
        method: 'PUT'
      };

      mid(req, {});
      assert.notOk(req.called);

      req = {
        url: getUrl('/foo'),
        method: 'PUT'
      };

      mid(req, {});
      assert.notOk(req.called);
    });
    it('should call the middleware when path or method mismatch', function () {
      req = {
        url: getUrl('/test?test=123'),
        method: 'PUT'
      };

      mid(req, {});
      assert.ok(req.called);

      req = {
        url: getUrl('/unless?test=123'),
        method: 'PUT'
      };

      mid(req, {});
      assert.ok(req.called);
    });
  });

  describe('with PATH exception', function () {
    var mid = unless({
      path: ['/test', '/fobo']
    }, testMiddleware);

    it('should not call the middleware when one of the path match', function () {
      var req = {
        url: getUrl('/test?das=123')
      };

      mid(req, {});

      assert.notOk(req.called);

      req = {
        url: getUrl('/fobo?test=123')
      };

      mid(req, {});

      assert.notOk(req.called);
    });

    it('should call the middleware when the path doesnt match', function () {
      var req = {
        url: getUrl('/foobar/test=123')
      };

      mid(req, {});

      assert.ok(req.called);
    });
  });

  describe('with PATH (regex) exception', function () {
    var mid = unless({
      path: ['/test', /ag$/ig]
    }, testMiddleware);

    it('should not call the middleware when the regex match', function () {
      req = {
        url: getUrl('/foboag?test=123')
      };

      req2 = {
        url: getUrl('/foboag?test=456')
      };

      mid(req, {});
      mid(req2, {});

      assert.notOk(req.called);
      assert.notOk(req2.called);
    });

  });

  describe('with EXT exception', function () {
    var mid = unless({
      ext: ['jpg', 'html', 'txt']
    }, testMiddleware);

    it('should not call the middleware when the ext match', function () {
      var req = {
        url: getUrl('/foo.html?das=123')
      };

      mid(req, {});

      assert.notOk(req.called);
    });

    it('should call the middleware when the ext doesnt match', function () {
      var req = {
        url: getUrl('/foobar/test=123')
      };

      mid(req, {});

      assert.ok(req.called);
    });
  });

  describe('with METHOD exception', function () {
    var mid = unless({
      method: ['OPTIONS', 'DELETE']
    }, testMiddleware);

    it('should not call the middleware when the method match', function () {
      var req = {
        url: getUrl('/foo.html?das=123'),
        method: 'OPTIONS'
      };

      mid(req, {});

      assert.notOk(req.called);
    });

    it('should call the middleware when the method doesnt match', function () {
      var req = {
        url: getUrl('/foobar/test=123'),
        method: 'PUT'
      };

      mid(req, {});

      assert.ok(req.called);
    });
  });

  describe('with custom exception', function () {
    var mid = unless(function (req) {
      return req.baba;
    }, testMiddleware);

    it('should not call the middleware when the custom rule match', function () {
      var req = {
        baba: true
      };

      mid(req, {});

      assert.notOk(req.called);
    });

    it('should call the middleware when the custom rule doesnt match', function () {
      var req = {
        baba: false
      };

      mid(req, {});

      assert.ok(req.called);
    });
  });

  describe('without originalUrl', function () {
    var mid = unless({
      path: ['/test']
    }, testMiddleware);

    it('should not call the middleware when one of the path match', function () {
      var req = {
        url: getUrl('/test?das=123')
      };

      mid(req, {});

      assert.notOk(req.called);
    });

    it('should call the middleware when the path doesnt match', function () {
      var req = {
        url: getUrl('/foobar/test=123')
      };

      mid(req, {});

      assert.ok(req.called);
    });
  });

});
