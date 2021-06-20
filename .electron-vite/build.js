'use strict';

process.env.NODE_ENV = 'production'

const path = require('path');
const rollup = require('rollup');
const { compileFile } = require('bytenode');

const { default: nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const esbuild = require('rollup-plugin-esbuild');

const { build } = require('vite');
const renderOptions = require('./vite.config');

const createMainProcessOptions = require('./rollup.main.config');
const mainOpt = createMainProcessOptions(process.env.NODE_ENV);

const resolve = (path1) => path.join(__dirname, '..', path1);

const Multispinner = require('multispinner');
main();

function main(){
    const tasks = ['main', 'render'];
    const mulitTask = new Multispinner(tasks, {
        preText: 'building',
        postText: 'process',
    })

    rollup.rollup(mainOpt)
        .then(build => {
            build.write(mainOpt.output)
                .then(() => {
                    mulitTask.success('main');
                })
        }, err => {
            mulitTask.error('main');
            console.error(err);
            process.exit(1);
        });

    build(renderOptions)
        .then(res => {
            mulitTask.success('render');
        }, err => {
            mulitTask.error('render');
            console.error(err);
            process.exit(1);
        });

    mulitTask.once('done', async () => {
        byteScripts(showByteScripts);
    })
}

const showByteScripts = [
    resolve('dist/electron/main/main.js'),
    // resolve('dist/electron/render/index.js'),
]

/**
 * 
 * @param {string[]} scripts 
 */
function byteScripts(scripts) {
    const cryptoExtension = `.${process.env.CRYPTO_EXTENSION || 'jsc'}`;
    rollup.rollup({
        input: resolve('.electron-vite/bytenode.runtime.js'),
        plugins: [
            nodeResolve({
                preferBuiltins: true,
                browser: true,
            }),
            commonjs(),
            esbuild({
                minify: true,
            })
        ],
        external: [ RegExp(`${cryptoExtension}$`) ],
    }).then(build => {
        scripts.map(src => {
            const origin = path.parse(src);
    
            const targetFileName = origin.base.replace(origin.ext, cryptoExtension);
            const targetPath = src.replace(origin.base, targetFileName);
    
            return {
                src: src,
                fileName: targetFileName,
                target: targetPath,
            }
        }).forEach(async ({ src, fileName, target }) => {
            await compileFile({
                filename: src,
                electron: true,
                output: target,
            });
            build.write({
                file: src,
                format: 'cjs',
                exports: 'auto',
                outro: `require("${ `./${fileName}`}");`,
            },)
        });
    });
}