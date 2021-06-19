'use strict';

process.env.NODE_ENV = 'production'

const { resolve: join } = require('path');
const createMainProcessOptions = require('./rollup.main.config');
const rollup = require('rollup');
const mainOpt = createMainProcessOptions(process.env.NODE_ENV);
const fs = require('fs');
const { default: nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');

const { build } = require('vite');
const renderOptions = require('./vite.config');

const ByteNode = require('bytenode');

const resolve = (path) => join(__dirname, '..', path);

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

// byteScripts(showByteScripts);

/**
 * 
 * @param {string[]} scripts 
 */
function byteScripts(scripts) {
    scripts.map(src => {
        const target = src.split('\\');
        const originFileName = target.pop();
        const targetFileName = originFileName.split('.');

        targetFileName[targetFileName.length - 1] = 'jshxd';

        const fileName = targetFileName.join('.');
        target.push(fileName);

        return {
            src: src,
            target: target.join('\\'),
            originFileName,
            fileName: fileName,
        }
    }).forEach( async ({ src, fileName }) => {
        try {
            await ByteNode.compileFile({
                filename: src,
                electron: true,
            });
            const template = (await fs.promises.readFile(join(__dirname, './bytenode.template'))).toString();
            await fs.promises.writeFile(src, template);

            rollup.rollup({
                input: src,
                plugins: [
                    nodeResolve({
                        preferBuiltins: true,
                        browser: true,
                    }),
                    commonjs(),
                ],
                external: [ /.jshxd$/ ],
            }).then(build => {
                console.log(build.code)
                build.write({
                    file: src,
                    format: 'cjs',
                    exports: 'auto',
                    footer: `;require("${ `./${fileName}`}")`,
                },);
            })
        } catch(err) {
            console.log(err);
        }
        console.log(`build ${src} success`);
    })
}