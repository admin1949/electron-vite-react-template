import React from "react";
import { DesktopMsg } from '@render/tools/notification';
import {HOT_UPDATE_SIGNAL  } from '@publicEnum/update';
const { ipcRenderer } = require('electron');
import { Button, Typography } from 'antd';

const crash = () => {
    process.crash();
}

export const Home = () => {
    const hotUpdate = () => {
        ipcRenderer.invoke(HOT_UPDATE_SIGNAL.CHECK_HOT_UPDATE);
    }

    const openMainProcessDialog = () => {
        ipcRenderer.invoke('open-message-box', {
            message: 'main process dialog',
        })
    }

    const notification = () => {
        DesktopMsg({
            title: '测试标题',
            body: '测试内容'
        }).then(openMainProcessDialog);
    }

    return <div>
        <Typography.Title level={2}>常用功能</Typography.Title>
        <Button type="primary" shape="round" size="large" onClick={hotUpdate}>热更新</Button>
        <Button type="primary" shape="round" size="large" onClick={notification}>发送通知</Button>
        <Button type="primary" shape="round" size="large" onClick={openMainProcessDialog}>创建弹窗</Button>
        <Button type="primary" shape="round" size="large" onClick={crash}>模拟崩溃</Button>
    </div>
}