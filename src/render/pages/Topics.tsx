import React from "react";
import { Link, Switch, useRouteMatch, Route, useParams } from 'react-router-dom';

export const Topics = () => {
    const match = useRouteMatch();
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
            </Route>
        </Switch>
    </>
}

const Topic = () => {
    const { topicId } = useParams<{topicId: string}>();
    return <h1>tpoicId is {topicId}</h1>
}