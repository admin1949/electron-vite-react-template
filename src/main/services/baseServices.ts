import { BrowserWindow } from 'electron';

export class BaseServices<T> {
    mainWindow: BrowserWindow | null = null;
    private signalName: string = '';

    constructor(signalName: string =  'baseServicesSignalName') {
        this.signalName = signalName;
    }

    public setMainWindow(mainWindow: BrowserWindow | null) {
        this.mainWindow = mainWindow;
        return this;
    }
    sendMessage(code: T, msg?: any) {
        if (null === this.mainWindow) {
            return;
        }

        this.mainWindow.webContents.send(this.signalName, {
            code,
            msg,
        })
    }
}
