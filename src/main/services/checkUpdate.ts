import { autoUpdater } from 'electron-updater';
import { ipcMain, BrowserWindow } from 'electron';
import { UPDATE_STATUS, UPDATE_SIGNAL } from '@publicEnum/update';
import { hotUpdate } from '../../../config/config.json';
import { arch } from 'os';

class Update {
    private mainWindow: BrowserWindow | null
    constructor() {
        this.mainWindow = null;
        autoUpdater.setFeedURL(`${hotUpdate.downloadUrl}${arch()}`);

        this.registCheckUpdate();
        this.registQuitAndInstall();

        this.lisenUpdateError();
        this.lisenUpdateStart();
        this.lisenUpdateNotAvailable();
        this.lisenUpdateAvailable();
        this.lisenUpdateDownloadProgress();
        this.lisenUpdateDownloaded();
    }

    private lisenUpdateError() {
        autoUpdater.on('error', (err) => {
            console.log('更新出现错误', err.message);
            if (err.message.includes('sha512 checksum mismatch')) {
                this.sendMessage(UPDATE_STATUS.ERROR, 'sha512校验失败');
            } else {
                this.sendMessage(UPDATE_STATUS.ERROR, '错误信息请看主进程控制台');
            }
        })
    }

    private lisenUpdateStart() {
        autoUpdater.on('checking-for-update', () => {
            console.log('开始检查更新');
            this.sendMessage(UPDATE_STATUS.START);
        });
    }

    private lisenUpdateAvailable() {
        autoUpdater.on('update-available', () => {
            console.log('发现可用更新');
            this.sendMessage(UPDATE_STATUS.HAS_NEW_VERSION);
        });
    }
    
    private lisenUpdateNotAvailable() {
        autoUpdater.on('update-not-available', () => {
            console.log('未发现可用更新');
            this.sendMessage(UPDATE_STATUS.HAS_NOT_NEW_VERSION);
        })
    }

    private lisenUpdateDownloadProgress() {
        autoUpdater.on('download-progress', (progress) => {
            this.sendMessage(UPDATE_STATUS.DOWNLOAD_PROGRESS, progress);
        });
    }

    private lisenUpdateDownloaded() {
        autoUpdater.on('update-downloaded', () => {
            console.log('新版本下载完成');
            this.sendMessage(UPDATE_STATUS.DOWNLOAD_SUCCESS);
        })
    }
    
    setMainWindow(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    protected sendMessage(code: UPDATE_STATUS, msg: string = '') {
        if (null === this.mainWindow) {
            return;
        }

        this.mainWindow.webContents.send(UPDATE_SIGNAL.UPDATE_MSG, {
            code,
            msg
        })
    }

    private registCheckUpdate() {
        ipcMain.handle(UPDATE_SIGNAL.CHECK_UPDATE, () => {
            autoUpdater.checkForUpdates()
                .then(res => {
                    console.log(res.updateInfo);
                }, err => {
                    console.error(err);
                    this.sendMessage(UPDATE_STATUS.ERROR, '检查更新失败');
                })
        })
    }

    private registQuitAndInstall() {
        ipcMain.handle(UPDATE_SIGNAL.CONFIRM_UPDATE, () => {
            autoUpdater.quitAndInstall();
        })
    }
}

export const updateHandle = new Update;