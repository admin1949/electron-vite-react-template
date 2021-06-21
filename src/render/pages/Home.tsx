import React from "react";
import { DesktopMsg } from '@render/tools/notification';
import {HOT_UPDATE_SIGNAL  } from '@publicEnum/update';
const { ipcRenderer } = require('electron');

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
    return <>
        <h1>welcome to the react</h1>
        <button onClick={hotUpdate} type="button">hot update</button><br/>
        <button onClick={notification} type="button">notification</button><br/>
        <button onClick={openMainProcessDialog} type="button">dialog main process</button>
    </>
}