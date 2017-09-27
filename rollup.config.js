
'use strict';

const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

module.exports = {
    entry: 'lib/index.js',
    format: 'cjs',
    plugins: [
        resolve({main: true}),
        commonjs(),
        babel(),
    ],
    dest: 'dist/web-pinyin.js'
}
