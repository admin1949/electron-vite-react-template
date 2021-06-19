import { app, BrowserWindow, Menu, dialog } from 'electron';
import { winURL, loadURL, isDevelopment } from '../config/staticPath';
import { menuConfig } from '../config/menu';
import { MessageBoxOptions } from 'electron/common';
import { connectIpcServer } from './ipcMain';

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

        connectIpcServer(this.mainWindow);

        this.mainWindow.webContents.once('dom-ready', () => {
            this.mainWindow!.show();
        });

        if (isDevelopment) {
            this.mainWindow.webContents.openDevTools({ mode: 'undocked', activate: true });
        }

        app.on('render-process-gone', (event, webContents, details) => {
            const message: MessageBoxOptions = {
                title: '警告',
                message: '',
                buttons: ['确定', '退出'],
            }
            switch(details.reason) {
                case 'crashed':
                    message.message = '图形化进程崩溃，是否进行软重启操作？';
                    break;
                case 'oom':
                    message.message = "内存不足，是否软重启释放内存？"
                    break
                case 'killed':
                default:
                    message.message = '由于未知原因导致图形化进程被终止，是否进行软重启操作？';
                    break;
            }

            dialog.showMessageBox({
                ...message,
                type: 'warning',
                noLink: true,
            }).then(res => {
                if (res.response === 0) {
                    this.mainWindow!.reload()
                } else {
                    this.mainWindow!.close();
                }
            });
        })

        app.on('child-process-gone', (event, details) => {
            const message: MessageBoxOptions = {
                title: '警告',
                message: '',
                buttons: ['确定', '退出'],
            }
            switch(details.reason) {
                case 'crashed':
                    message.message = '硬件加速进程已崩溃，是否关闭硬件加速并重启？';
                    break;
                case 'killed':
                default:
                    message.message = '硬件加速进程被意外终止，是否关闭硬件加速并重启？';
                    break;
            }

            dialog.showMessageBox({
                ...message,
                type: 'warning',
                noLink: true,
            }).then(res => {
                if (!this.mainWindow) {
                    return;
                }
                if (res.response === 0) {
                    if (details.type === 'GPU') {
                        app.disableHardwareAcceleration();
                    }
                    this.mainWindow.reload()
                } else {
                    this.mainWindow.close();
                }
            });
        });

        this.mainWindow.once('closed', () => {
            this.mainWindow = null;
        })
    }

    initWindow() {
        return this.createMainWindow();
    }
}