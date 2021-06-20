import { UPDATE_SIGNAL, UPDATE_STATUS } from '@publicEnum/update';
const { ipcRenderer } = require('electron');
import { message, Modal } from 'antd';

ipcRenderer.on(UPDATE_SIGNAL.UPDATE_MSG, (event, msg: {code: UPDATE_STATUS, msg: string}) => {
    switch(msg.code) {
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
            message.error(`获取升级状态失败: ${msg.msg}`);
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
            message.info(`未知状态${msg.code}`);
    }
    console.log(msg);
});