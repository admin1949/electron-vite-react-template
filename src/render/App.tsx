import React, { useState, forwardRef, useContext, useEffect } from 'react';
import { Switch, Route, Link, NavLink, LinkProps } from 'react-router-dom';
import { Home } from '@render/pages/Home';
import { Setting } from '@render/pages/Setting';
import { Topics } from '@render/pages/Topics';
import { Blogs } from '@render/pages/Blogs';
import { Layout, Divider, Typography  } from 'antd';
import { RobotOutlined, HomeOutlined, EuroCircleOutlined, ClockCircleOutlined, DeploymentUnitOutlined, ControlOutlined } from '@ant-design/icons';
import style from './App.module.less';
import { HotUpdateContenx, registHotUpdateEvent } from './tools/update';
import { HOT_UPDATE_STATUS } from '@publicEnum/update';

const { Sider, Content } = Layout;


export const App = () => {
    const [status, setStatus] = useState(HOT_UPDATE_STATUS.SUCCESS);
    useEffect(() => {
        console.log('app render');
        registHotUpdateEvent(setStatus);
    }, []);
    return <HotUpdateContenx.Provider value={status}>
         <Layout style={{height: '100%', backgroundColor: '#fff'}}>
            <Sider theme='dark'>
                <NavBar></NavBar>
            </Sider>
            <Content style={{padding: '4px'}}>
            <h1>this is old project</h1>
                <Switch>
                    <Route path="/setting">
                        <Setting/>
                    </Route>
                    <Route path="/clock">
                        <Topics/>
                    </Route>
                    <Route path="/blogs">
                        <Blogs/>
                    </Route>
                    <Route path="/test">
                        test 2233
                    </Route>
                    <Route path="/">
                        <Home/>
                    </Route>
                </Switch>
            </Content>
        </Layout>
    </HotUpdateContenx.Provider>
}

const NavBar = () => {
    return <nav className={style['nav-bar']} >
        <div className={style.header}>
            <div className={style['nav-bar-app']}>
                <RobotOutlined className={style.icon} />
                <span>the answer</span>
            </div>
            <Divider style={{marginBottom: 0, borderTopColor: '#5f5f5f', marginTop: '12px'}} />
            <NavLink to='/home' activeClassName={`${style.active} ${style['nav-bar-item']}`} className={style['nav-bar-item']} component={SelfLink}>
                <HomeOutlined className={style.icon} />
                <span>Home</span>
            </NavLink>
            <NavLink to='/clock' activeClassName={`${style.active} ${style['nav-bar-item']}`} className={style['nav-bar-item']} component={SelfLink}>
                <ClockCircleOutlined className={style.icon} />
                <span>Clock</span>
            </NavLink>
            <NavLink to='/setting' activeClassName={`${style.active} ${style['nav-bar-item']}`} className={style['nav-bar-item']} component={SelfLink}>
                <ControlOutlined className={style.icon} />
                <span>Setting</span>
            </NavLink>
            <Divider style={{marginBottom: 0, borderTopColor: '#5f5f5f', marginTop: '12px'}} />
            <NavLink to='/blogs' activeClassName={`${style.active} ${style['nav-bar-item']}`} className={style['nav-bar-item']} component={SelfLink}>
                <DeploymentUnitOutlined className={style.icon} />
                <span>Blogs</span>
            </NavLink>
        </div>
        <div className={style.footer}>
            <EuroCircleOutlined className={style.icon} />
            <span>Yimisanqi</span>
        </div>
    </nav>
}

const SelfLink = forwardRef<HTMLDivElement, { navigate: () => void, href?: string, children: any }>(({ navigate, href, children, ...resrt }, ref) => {
    return <div onClick={navigate} {...resrt}>
        {children}
    </div>
});