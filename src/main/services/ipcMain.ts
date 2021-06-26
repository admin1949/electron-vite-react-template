import { ipcMain, dialog, BrowserWindow, app } from 'electron';
import { MessageBoxOptions } from 'electron/main';
import { SYSTEM_SIGNAL } from '@publicEnum/system';
import { HOT_UPDATE_SIGNAL } from '@publicEnum/update';
import { hopUpdateHandle } from '@main/services/hotUpdate';
import { BaseServices } from './baseServices';

class IpcServices extends BaseServices<SYSTEM_SIGNAL> {
    constructor() {
        super();
        ipcMain.handle('windows-mini', async () => {
            this.mainWindow?.minimize();
        });
    
        ipcMain.handle('windows-max', async () => {
            if (this.mainWindow?.isMaximized()) {
                this.mainWindow?.restore();
                return { status: false };
            }
            this.mainWindow?.maximize();
            return { status: true };
        });
    
        ipcMain.handle('windows-close', () => {
            this.mainWindow?.close();
        });
    
        ipcMain.handle('open-message-box', async (event, arg: MessageBoxOptions) => {
            const defaultOptions: MessageBoxOptions = {
                type: 'info',
                message: '',
                buttons: [],
                noLink: true,
                title: '',
            }
            return await dialog.showMessageBox(Object.assign(defaultOptions, arg));
        });
    
        ipcMain.handle(HOT_UPDATE_SIGNAL.CHECK_HOT_UPDATE, async () => {
            hopUpdateHandle.run();
            console.log('hot update');
        });
    
        ipcMain.handle(HOT_UPDATE_SIGNAL.CONFIRM_HOT_UPDATE, async () => {
            console.log('退出重启');
            app.relaunch();
            app.exit();
        });
    
        ipcMain.handle(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_REQUEST, () => {
            this.mainWindow?.webContents.openDevTools({
                mode: 'right'
            });
            this.mainWindow?.webContents.send(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_SUCCESS);
        })
    }

}

export const ipcServices = new IpcServices();
