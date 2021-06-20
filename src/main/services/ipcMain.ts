import { ipcMain, dialog, BrowserWindow } from 'electron';
import { MessageBoxOptions } from 'electron/main';
import { SYSTEM_SIGNAL } from '@publicEnum/system';

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

    ipcMain.handle('hot-update', async () => {
        console.log('hot update');
    });

    ipcMain.handle(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_REQUEST, () => {
        mainWindow.webContents.openDevTools({
            mode: 'right'
        });
        mainWindow.webContents.send(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_SUCCESS);
    })
}