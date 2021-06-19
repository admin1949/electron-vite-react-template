import React from "react";
const { ipcRenderer } = require('electron');
import { DesktopMsg } from '@render/tools/notification';

export const Home = () => {
    const hotUpdate = () => {
        // const res = ipcRenderer.invoke('hot-update')
        // console.log(res);
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