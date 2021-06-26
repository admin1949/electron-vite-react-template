import { app, Menu, Tray, BrowserWindow } from 'electron';
import { BaseServices } from './baseServices';
import { join } from 'path';
import { taryPath } from '@main/config/staticPath';
import MainInit from './windowManager';

class TaryServices extends BaseServices<string> {
    tary: Tray | null = null;
    constructor() {
        super();
        app.whenReady().then(() => {
            this.buildTary();
        });
    }
    protected buildTary() {
        this.tary = new Tray(join(taryPath, './icon.ico'));
        const contextMenu = Menu.buildFromTemplate([
            {
                label: '显示主界面',
                click: () => {
                    if (!this.mainWindow) {
                        new MainInit().initWindow();
                    } else {
                        this.mainWindow?.show();
                        app.focus();
                    }
                }
            },
            {
                label: '退出',
                click: () => {
                    this.mainWindow?.close();
                    app.exit();
                }
            }
        ])
        this.tary.setContextMenu(contextMenu);
        this.tary.on('double-click', () => {
            if (this.mainWindow) {
                this.mainWindow.show();
                app.focus();
            } else {
                new MainInit().initWindow();
            }
        })
    }
}

export const tary = new TaryServices();