export default function (options, middleware) {
  let opts = typeof options === 'function' ? {custom: options} : options;

  return async function (req, res) {
    let url = req.url;

    let skip = false;

    if (opts.custom) {
      skip = skip || opts.custom(req);
    }

    let paths = !opts.path || Array.isArray(opts.path) ? opts.path : [opts.path];

    if (paths) {
      skip = skip || paths.some(function (p) {
        return isUrlMatch(p, url.pathname) && isMethodMatch(p.methods, req.method);
      });
    }

    let exts = (!opts.ext || Array.isArray(opts.ext)) ? opts.ext : [opts.ext];

    if (exts) {
      skip = skip || exts.some(function (ext) {
        return url.pathname.substr(ext.length * -1) === ext;
      });
    }

    let methods = (!opts.method || Array.isArray(opts.method)) ? opts.method : [opts.method];

    if (methods) {
      skip = skip || methods.includes(req.method);
    }

    if (!skip) {
      return await middleware(req, res);
    }
  };
};

function isUrlMatch(p, url) {
  let ret = (typeof p === 'string' && p === url) || (p instanceof RegExp && !!p.exec(url));
  if (p instanceof RegExp) {
    p.lastIndex = 0;
  }

  if (p && p.url) {
    ret = isUrlMatch(p.url, url);
  }
  return ret;
}

function isMethodMatch(methods, m) {
  if (!methods) {
    return true;
  }

  methods = Array.isArray(methods) ? methods : [methods];

  return methods.includes(m);
}
