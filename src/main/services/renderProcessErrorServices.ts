import { BaseServices } from "./baseServices";
import { app, dialog, MessageBoxOptions, } from 'electron'

class RenderProcessErrorServices extends BaseServices<string> {
    constructor () {
        super();
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
                    this.mainWindow?.reload()
                } else {
                    this.mainWindow?.close();
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
    }
}

export const renderProcessErrorServices = new RenderProcessErrorServices();