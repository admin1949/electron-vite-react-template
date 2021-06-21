import { ipcMain, dialog, BrowserWindow, app } from 'electron';
import { MessageBoxOptions } from 'electron/main';
import { SYSTEM_SIGNAL } from '@publicEnum/system';
import { HOT_UPDATE_SIGNAL } from '@publicEnum/update';
import { hopUpdateHandle } from '@main/services/hotUpdate';

export const connectIpcServer = (mainWindow: BrowserWindow) => {
    ipcMain.handle('windows-mini', async () => {
        mainWindow.minimize();
    });

    ipcMain.handle('windows-max', async () => {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
            return { status: false };
        }
        mainWindow.maximize();
        return { status: true };
    });

    ipcMain.handle('windows-close', () => {
        mainWindow.close();
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
        mainWindow.webContents.openDevTools({
            mode: 'right'
        });
        mainWindow.webContents.send(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_SUCCESS);
    })
}