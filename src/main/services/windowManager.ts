import { app, BrowserWindow, Menu, dialog } from 'electron';
import { winURL, loadURL, isDevelopment } from '../config/staticPath';
import { menuConfig } from '../config/menu';
import { ipcServices } from './ipcMain';
import { updateHandle } from './checkUpdate';
import { hopUpdateHandle } from '@main/services/hotUpdate';
import { store } from './store';
import { STORE_KEY } from '@publicEnum/store';
import { tary } from './tary';
import { renderProcessErrorServices } from './renderProcessErrorServices';

let waitLoadWindow = Promise.resolve();
const useLoadingPage = store.store.get(STORE_KEY.USE_LOADING_PAGE, true);

export default class MainInit {
    public winURL: string = '';
    public startURL: string = '';
    public loadWindow: BrowserWindow | null = null;
    public mainWindow: BrowserWindow | null = null;

    constructor() {
        this.winURL = winURL;
        this.startURL = loadURL;
        if (isDevelopment) {
            menuConfig.push({
                label: '开发者模式',
                submenu: [
                    {
                        label: '切换到开发者模式',
                        accelerator: 'CmdOrCtrl+I',
                        role: 'toggleDevTools',
                    }
                ]
            });
        }
    }

    createMainWindow() {
        this.mainWindow = new BrowserWindow({
            width: 1700,
            height: 800,
            minWidth: 1366,
            show: false,
            titleBarStyle: 'hidden',
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                webSecurity: false,
                devTools: isDevelopment,
                scrollBounce: process.platform === 'darwin',
            }
        });
        const menu = Menu.buildFromTemplate(menuConfig);
        Menu.setApplicationMenu(menu);

        this.mainWindow.loadURL(this.winURL);

        updateHandle.setMainWindow(this.mainWindow);
        hopUpdateHandle.setMainWindow(this.mainWindow);
        store.setMainWindow(this.mainWindow);
        tary.setMainWindow(this.mainWindow);
        ipcServices.setMainWindow(this.mainWindow);
        renderProcessErrorServices.setMainWindow(this.mainWindow);

        this.mainWindow.webContents.once('dom-ready', () => {
            waitLoadWindow.finally(() => {
                if (null !== this.loadWindow) {
                    this.loadWindow.close();
                    this.loadWindow = null;
                }
                if (null === this.mainWindow) {
                    return;
                }
                this.mainWindow.show();
                console.log('main window show');
                app.focus();
                console.log('main window focus');
            })
        });

        this.mainWindow.on('close' , (event) => {
            if (store.store.get(STORE_KEY.USE_TARY_EXIT, true)) {
                this.mainWindow?.hide();
            } else {
                app.exit();
            }
        });

        if (isDevelopment) {
            this.mainWindow.webContents.openDevTools({ mode: 'right', activate: true });
        }

        this.mainWindow.once('closed', () => {
            this.mainWindow = null;

            // 删除所有主窗口的引用
            updateHandle.setMainWindow(this.mainWindow);
            hopUpdateHandle.setMainWindow(this.mainWindow);
            store.setMainWindow(this.mainWindow);
            tary.setMainWindow(this.mainWindow);
            ipcServices.setMainWindow(this.mainWindow);
            renderProcessErrorServices.setMainWindow(this.mainWindow);
        })
    }

    createLoadingWindow() {
        if (null !== this.loadWindow) {
            this.loadWindow.close();
        }
        this.loadWindow = new BrowserWindow({
            width: 900,
            height: 350,
            frame: false,
            transparent: true,
            resizable: false,
            webPreferences: {
                nodeIntegration: true,
            }
        });
        this.loadWindow.loadURL(this.startURL);
        this.loadWindow.show();
        this.loadWindow.setAlwaysOnTop(true);
        waitLoadWindow = new Promise((res) => {
            setTimeout(res, 3000);
        });
    }

    async initWindow() {
        if (useLoadingPage) {
            this.createLoadingWindow();
        }
        return this.createMainWindow();
    }
}