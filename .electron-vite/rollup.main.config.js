const { resolve } = require('path');
const { default: nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const esbuild = require("rollup-plugin-esbuild");
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json')
const { RollupOptions } = require('rollup');

const input = resolve(__dirname, '../src/main/index.ts');
const output = resolve(__dirname, '../dist/electron/main/main.js')

/**
 * 
 * @param {String} env 
 * @returns {RollupOptions}
 */
module.exports = (env = 'production') => {
    const isProduction = env === 'production'
    return {
        input: input,
        output: {
            file: output,
            format: 'cjs',
            name: 'MainProcess',
            sourcemap: false,
        },
        plugins: [
            nodeResolve({
                preferBuiltins: true,
                browser: true,
            }),
            commonjs(),
            json(),
            esbuild({
                include: /\.[jt]sx?$/,
                exclude: /node_modules/,
                sourcemap: false,
                minify: isProduction,
                target: 'es2017',
                define: {
                    __VERSION__: '"x.y.z"'
                },
                loaders: {
                    '.json': 'json',
                    '.js': 'jsx',
                },
            }),
            alias({
                entries: [
                    { find: '@main', replacement: resolve('../src/main') },
                    { find: '@config', replacement: resolve('../config') }
                ]
            })
        ],
        external: [
            'fs',
            'crypto',
            'os',
            'electron',
        ]
    }
}