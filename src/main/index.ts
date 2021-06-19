import { app } from 'electron';
import MainInit from './services/windowManager';

function onAppReady() {
    new MainInit().initWindow();
}

app.isReady() ? onAppReady() : app.on('ready', onAppReady);

app.on('window-all-closed', () => {
    app.quit();
});

app.on('browser-window-created', () => {
    console.log('browser-window-created');
});

