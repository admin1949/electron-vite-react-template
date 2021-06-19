process.env.NODE_ENV = 'development';

const { spawn } = require('child_process');
const chalk = require('chalk');
const { say } = require('cfonts');
const electron = require('electron');
const path = require('path');
const rollup = require('rollup');
const createMainProcessOptions = require('./rollup.main.config');
const mainOpt = createMainProcessOptions(process.env.NODE_ENV);
const portFinder = require('portfinder');

const { createServer } = require('vite');
const renderOptions = require('./vite.config');

let electronProcess = null;
let isRestartElectron = false;

function logProcessInfo(processName = '主进程', data) {
    const info = typeof data === 'object'
        ? data.toString({
            colors: true,
            chunks: false,
        }).split(/\r?\n/).map(row => `  ${row}\n`).join('')
        : `  ${data}\n`;
    
    const log = [
        chalk.yellow.bold(`┏ ${processName} Process ${new Array((19 - processName.length) + 1).join('-')}`),
        '\n\n',
        info,
        '\n',
        chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`),
        '\n'
    ].join('');

    console.log(log);
}

function startMain() {
    return new Promise((resolve, reject) => {
        const watcher = rollup.watch(mainOpt)
        watcher.on('change', fileName => {
            logProcessInfo('Main-FileChange', fileName);
        });
        watcher.on('event', event => {
            if(event.code === 'END') {
                if (electronProcess && electronProcess.kill) {
                    isRestartElectron = true;
                    process.kill(electronProcess.pid);
                    electronProcess = null;
                    startElectron();
                    setTimeout(() => {
                        isRestartElectron = false
                    }, 5000);
                }
                resolve();
            } else if (event.code === 'ERROR') {
                reject(event.error);
            }
        })
    });     
}

function startElectron() {
    const args = [
        '--inspect=5858',
        path.resolve(__dirname, '../dist/electron/main/main.js'),
    ];

    electronProcess = spawn(electron, args);

    electronProcess.stdout.on('data', data => {
        logElectronInfo(removeJunk(data), 'blue');
    });

    electronProcess.stderr.on('data', data => {
        logElectronInfo(removeJunk(data), 'red');
    });

    electronProcess.once('close', () => {
        if (!isRestartElectron) process.exit();
    })
}

function removeJunk(chunk) {
    // Example: 2018-08-10 22:48:42.866 Electron[90311:4883863] *** WARNING: Textured window <AtomNSWindow: 0x7fb75f68a770>
    if (/\d+-\d+-\d+ \d+:\d+:\d+\.\d+ Electron(?: Helper)?\[\d+:\d+] /.test(chunk)) {
        return false;
    }

    // Example: [90789:0810/225804.894349:ERROR:CONSOLE(105)] "Uncaught (in promise) Error: Could not instantiate: ProductRegistryImpl.Registry", source: chrome-devtools://devtools/bundled/inspector.js (105)
    if (/\[\d+:\d+\/|\d+\.\d+:ERROR:CONSOLE\(\d+\)\]/.test(chunk)) {
        return false;
    }

    // Example: ALSA lib confmisc.c:767:(parse_card) cannot find card '0'
    if (/ALSA lib [a-z]+\.c:\d+:\([a-z_]+\)/.test(chunk)) {
        return false;
    }

    return chunk;
}

function logElectronInfo(data, color = 'blue') {
    if (!data) {
        return;
    }

    const info = data.toString().split(/\r?\n/).map(line => `  ${line}`).join('\n');

    if (!/[0-9A-z]/.test(info)) {
        return;
    }

    const log = [
        chalk[color].bold(`┏ Electron -------------------`),
        '\n\n',
        info,
        '\n',
        chalk[color].bold(`┗ ----------------------------`),
        '\n',
    ].join('');

    console.log(log);
}

function startRender() {
    return new Promise((resolve, reject) => {
        portFinder.basePort = 9080;
        portFinder.getPort(async (err, port) => {
            if (err) {
                reject(err);
            } else {
                const server = await createServer(renderOptions);
                process.env.PORT = port;
                server.listen(port).then(() => {
                    console.log(chalk.blue('\nload main process, please wait...\n'));
                });
                resolve();
            }
        })
    });
}

function saylogo() {
    const logoText = 'electron-vite-react';

    say(logoText, {
        colors: ['yellow'],
        font: 'simple3d',
    });
    console.log(
        chalk.blue(`启动中...\n`)
    );
}

async function main() {
    saylogo();
    try{
        await startRender();
        await startMain();
        startElectron();
    }catch(err) {
        console.error(err);
        process.exit(1);
    }
}

main();