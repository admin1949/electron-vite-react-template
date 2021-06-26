import React, { useContext } from "react";
import style from './Setting.module.less';
import { Typography, List, Switch, Button } from 'antd';
import { HOT_UPDATE_STATUS } from '@publicEnum/update';
import { HotUpdateContenx, hotUpdateRelaunch } from '@render/tools/update';
import { useTypedSelector, useTypedDispatch } from "@render/store";
import { createToggleLoadingPageAction } from "@render/store/loadingPage/actions";
import { createToggleTaryExitAction } from "@render/store/taryExit/actions";


const { Text  } = Typography;

export const Setting = () => {
    const update = () => {
        if (val === HOT_UPDATE_STATUS.WAIT_RELAUNCH) {
            hotUpdateRelaunch();
            return;
        }
    }
    const useLoadingPage = useTypedSelector(state => state.loadingPage);
    const useTaryExit = useTypedSelector(state => state.taryExit);
    const dispatch = useTypedDispatch();

    const toggleLoadingPage = () => {
        dispatch(createToggleLoadingPageAction(!useLoadingPage.isOpen));
    }

    const toggleTaryExit = () => {
        dispatch(createToggleTaryExitAction(!useTaryExit.isOpen));
    }

    const val = useContext(HotUpdateContenx);

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
                <Switch checked={useLoadingPage.isOpen} loading={useLoadingPage.loading} onChange={toggleLoadingPage}></Switch>
            </List.Item>
            <List.Item>
                <Text>关闭窗口时保留至系统托盘</Text>
                <Switch checked={useTaryExit.isOpen} loading={useTaryExit.loading} onChange={toggleTaryExit}></Switch>
            </List.Item>
            <List.Item>
                <Text>在线更新</Text>
                <Button loading={isCheckUpdate} onClick={update}>检查更新</Button>
            </List.Item>
        </List>
    </div>
}

// 阻止系统关闭窗口时的默认行为，由主进程判断是否退出程序
window.onbeforeunload = e => {
    e.returnValue = false;
}
