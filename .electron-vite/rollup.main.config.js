const { resolve } = require('path');
const { default: nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const esbuild = require("rollup-plugin-esbuild");
const alias = require('@rollup/plugin-alias');
const json = require('@rollup/plugin-json')
const { RollupOptions } = require('rollup');
const replace = require('rollup-plugin-replace');

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
                sourcemap: !isProduction,
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
                    { find: '@main', replacement: resolve(__dirname, '../src/main') },
                    { find: '@config', replacement: resolve(__dirname, '../config') },
                    { find: '@publicEnum', replacement: resolve(__dirname, '../src/publicEnum') },
                ],
                customResolver: nodeResolve({
                    extensions: [ '.ts', '.json' ]
                })
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
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