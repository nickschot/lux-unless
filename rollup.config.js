import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';

let pkg = require('./package.json');
let external = pkg.dependencies ? Object.keys(pkg.dependencies) : [];

export default {
  entry: 'lib/index.js',
  plugins: [
    nodeResolve({
      module: true,
      jsnext: true,
      preferBuiltins: true
    }),
    babel()
  ],
  external: external,
  targets: [
    {
      dest: pkg['main'],
      format: 'cjs',
      sourceMap: true
    }
  ]
};
