import { app } from 'electron';
import MainInit from './services/windowManager';
import electronLog, { transports } from 'electron-log';
import { resolve } from 'path';
import { STORE_KEY } from '@publicEnum/store';
import { store } from './services/store';

transports.file.resolvePath = () => resolve(app.getAppPath(), 'logs/main.log');

if (process.env.NODE_ENV === 'production') {
    console = new Proxy(console, {
        get(target, prop) {
            if (typeof Reflect.get(electronLog, prop) === 'function') {
                return Reflect.get(electronLog, prop);
            }
            return Reflect.get(target, prop);
        }
    })
}

function onAppReady() {
    new MainInit().initWindow();
}

app.isReady() ? onAppReady() : app.on('ready', onAppReady);

app.on('window-all-closed', () => {
    const USE_TARY_EXIT = store.store.get(STORE_KEY.USE_TARY_EXIT, true);
    if (!USE_TARY_EXIT) {
        app.exit();
    }
});

app.on('browser-window-created', () => {
    console.log('browser-window-created');
});

