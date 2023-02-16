const path = require('path')
const flow = require('rollup-plugin-flow-no-whitespace')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = {
  input: resolve('src/index.js'),
  plugins: [
    flow(),
    replace({
      __VERSION__: version
    })
  ],
  external: ['vue'],
  output: {
    dir: 'dist',
    format: 'es',
    preserveModules: true,
    sourcemap: false
  }
}
