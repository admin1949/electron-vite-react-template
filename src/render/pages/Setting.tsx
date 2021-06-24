import React, { useContext, useEffect, useState } from "react";
import style from './Setting.module.less';
import { Typography, List, Switch, Button, message, Modal } from 'antd';
import { HOT_UPDATE_SIGNAL, HOT_UPDATE_STATUS } from '@publicEnum/update';
const { ipcRenderer } = require('electron');
import { HotUpdateContenx, hotUpdateRelaunch } from '@render/tools/update';
import { STORE_KEY } from "@publicEnum/store";
import { STORE_SIGNAL } from "@publicEnum/store";

const USE_LOADING_PAGE = await ipcRenderer.invoke(STORE_SIGNAL.GET_VALUE, [STORE_KEY.USE_LOADING_PAGE, true])

const { Title, Text  } = Typography;

export const Setting = () => {
    const update = () => {
        if (val === HOT_UPDATE_STATUS.WAIT_RELAUNCH) {
            hotUpdateRelaunch();
            return;
        }
        ipcRenderer.invoke(HOT_UPDATE_SIGNAL.CHECK_HOT_UPDATE);
    }
    const val = useContext(HotUpdateContenx);
    const [ useLoadingPage, setUseLoadingPage ] = useState(USE_LOADING_PAGE as boolean);
    const changeUseLoadingPageToStore = () => {
        const newStatus = !useLoadingPage
        ipcRenderer.invoke(STORE_SIGNAL.SET_VALUE, [STORE_KEY.USE_LOADING_PAGE, newStatus]);
        setUseLoadingPage(newStatus);
    }
    const isCheckUpdate = [
        HOT_UPDATE_STATUS.HAS_NEW_VERSION,
        HOT_UPDATE_STATUS.START_DOWNLOAD,
        HOT_UPDATE_STATUS.DOWNLOAD_PROGRESS,
        HOT_UPDATE_STATUS.DOWNLOAD_SUCCESS,
        HOT_UPDATE_STATUS.START_VERIFY_FILES,
        HOT_UPDATE_STATUS.START_MOVE_FILE,
    ].includes(val);

    return <div className={style.content}>
        <List
            bordered
            size="large"
            
        >
            <List.Item>
                <Text>开屏动画</Text>
                <Switch checked={useLoadingPage} onChange={changeUseLoadingPageToStore}></Switch>
            </List.Item>
            <List.Item>
                <Text>在线更新</Text>
                <Button loading={isCheckUpdate} onClick={update}>检查更新</Button>
            </List.Item>
        </List>
    </div>
}