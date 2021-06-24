import { UPDATE_SIGNAL, UPDATE_STATUS, HOT_UPDATE_SIGNAL, HOT_UPDATE_STATUS } from '@publicEnum/update';
const { ipcRenderer } = require('electron');
import { message, Modal } from 'antd';
import { createContext } from 'react';

ipcRenderer.on(UPDATE_SIGNAL.UPDATE_MSG, (event, { code, msg }: {code: UPDATE_STATUS, msg: string}) => {
    switch(code) {
        case UPDATE_STATUS.DOWNLOAD_SUCCESS:
            Modal.confirm({
                closable: true,
                title: "升级提示",
                maskClosable: false,
                onOk: () => {
                    ipcRenderer.invoke(UPDATE_SIGNAL.CONFIRM_UPDATE);
                }
            });
            break;
        case UPDATE_STATUS.ERROR:
            message.error(`获取升级状态失败: ${msg}`);
            break;
        case UPDATE_STATUS.HAS_NEW_VERSION:
            message.success('获取新版本成功，正在下载。');
            break;
        case UPDATE_STATUS.START:
            message.success('开始检查更新');
            break;
        case UPDATE_STATUS.HAS_NOT_NEW_VERSION:
            message.success('当前已经是最新版本了');
            break;
        default:
            message.info(`未知状态${code}`);
    }
});

let hasRegistHotUpdateEvent = false;
export const registHotUpdateEvent = (setStatus: (newStatus: HOT_UPDATE_STATUS) => void) => {
    if (hasRegistHotUpdateEvent) {
        return false;
    }
    hasRegistHotUpdateEvent = true;
    ipcRenderer.on(HOT_UPDATE_SIGNAL.HOT_UPDATE_MSG, (event, { code }: {code: HOT_UPDATE_STATUS}) => {
        switch(code) {
            case HOT_UPDATE_STATUS.HAS_NOT_NEW_VERSION:
                message.success('当前已经是最新版本了');
                break;
            case HOT_UPDATE_STATUS.HAS_NEW_VERSION:
                message.success('发现新版本');
                break;
            case HOT_UPDATE_STATUS.START_DOWNLOAD:
                message.success('开始下载新版本');
                break;
            case HOT_UPDATE_STATUS.DOWNLOAD_SUCCESS:
                message.success('下载完成');
                break;
            case HOT_UPDATE_STATUS.START_VERIFY_FILES:
                message.success('开始校验文件');
                break;
            case HOT_UPDATE_STATUS.VERIFY_FILE_ERROR:
                message.error('文件校验失败');
                break;
            case HOT_UPDATE_STATUS.START_MOVE_FILE:
                message.success('校验成功，开始复制文件');
                break;
            case HOT_UPDATE_STATUS.WAIT_RELAUNCH:
                hotUpdateRelaunch();
                break;
            default:
                message.info(`未知状态${code}`);
        }
        setStatus(code);
    })
}

export const hotUpdateRelaunch = () => {
    Modal.confirm({
        closable: true,
        title: "升级提示",
        content: '更新完成，是否立即重启？',
        maskClosable: false,
        onOk: () => {
            ipcRenderer.invoke(HOT_UPDATE_SIGNAL.CONFIRM_HOT_UPDATE);
        }
    });
}

export const HotUpdateContenx = createContext<HOT_UPDATE_STATUS>(HOT_UPDATE_STATUS.SUCCESS);