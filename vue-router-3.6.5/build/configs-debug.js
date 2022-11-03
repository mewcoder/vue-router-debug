const path = require('path')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('@rollup/plugin-commonjs')
const node = require('@rollup/plugin-node-resolve').nodeResolve
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [{}].map(genConfig)

function genConfig () {
  const config = {
    input: {
      input: resolve('src/index.js'),
      plugins: [
        flow(),
        node(),
        cjs(),
        replace({
          __VERSION__: version
        })
      ],
      external: ['vue']
    },
    output: {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      sourcemap: false
    }
  }
  return config
}
