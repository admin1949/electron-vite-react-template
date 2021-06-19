import React from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Home } from '@render/pages/Home';
import { About } from '@render/pages/About';
import { Topics } from '@render/pages/Topics';
import { Layout } from 'antd';

const { Sider, Content } = Layout;


export const App = () => {
    return <Layout style={{height: '100%'}}>
        <Sider>
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                </ul>
                <ul>
                    <li><Link to="/about">about</Link></li>
                </ul>
                <ul>
                    <li><Link to="/tpoics">tpoics</Link></li>
                </ul>
            </nav>
        </Sider>
        <Content>
            <Switch>
                <Route path="/about">
                    <About/>
                </Route>
                <Route path="/tpoics">
                    <Topics/>
                </Route>
                <Route path="/">
                    <Home/>
                </Route>
            </Switch>
        </Content>
    </Layout>
}