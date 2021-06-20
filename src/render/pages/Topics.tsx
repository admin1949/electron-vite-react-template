import React from "react";
import { Link, Switch, useRouteMatch, Route, useParams } from 'react-router-dom';
import { UPDATE_SIGNAL, UPDATE_STATUS } from '@publicEnum/update';
import { SYSTEM_SIGNAL } from '@publicEnum/system';
const { ipcRenderer } = require('electron');
import { Button, message } from 'antd';

ipcRenderer.on(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_SUCCESS, () => {
    message.success('open dev tool success');
})

export const Topics = () => {
    const match = useRouteMatch();
    const update = () => {
        ipcRenderer.invoke(UPDATE_SIGNAL.CHECK_UPDATE);
    }
    const openDevTools = () => {
        ipcRenderer.invoke(SYSTEM_SIGNAL.OPEN_DEV_TOOLS_REQUEST);
    }
    return <>
        <h1>Tpoics</h1>
        <ul>
            <li><Link to={`${match.url}/components`}>components</Link></li>
            <li><Link to={`${match.url}/props-v-slots`}>props-v-slots</Link></li>
        </ul>
        <Switch>
            <Route path={`${match.path}/:topicId`}>
                <Topic></Topic>
            </Route>
            <Route path={match.path}>
                <h3>please select tpoicId</h3>
                <button onClick={update}>update</button>
                <Button onClick={openDevTools}>open dev tool</Button>
            </Route>
        </Switch>
    </>
}

const Topic = () => {
    const { topicId } = useParams<{topicId: string}>();
    return <h1>tpoicId is {topicId}</h1>
}