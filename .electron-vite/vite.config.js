const { join } = require('path');
const reactPlugin = require('@vitejs/plugin-react-refresh');
const { defineConfig } = require('vite');

const resolve = (path) => join(__dirname, '..', path);

const root = resolve('src/render');

module.exports = defineConfig({
    root: root,
    mode: process.env.NODE_ENV,
    resolve: {
        alias: {
            "@render": root,
        },
    },
    base: './',
    build: {
        outDir: resolve('dist/electron/render'),
        emptyOutDir: true,
        rollupOptions: {
            output: {
                entryFileNames: '[name].js',
            }
        },
        target: 'esnext',
    },
    plugins: [
        reactPlugin(),
    ],
    publicDir: resolve('static'),
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
});