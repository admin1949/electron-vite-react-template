import React from 'react';
import { Typography } from 'antd';
import logo from '@render/assets/image/logo.png';
import { useSystemInfo } from "@render/hooks/useSystemInfo";

export const SystemInfo = () => {
    const systemInfo = useSystemInfo();
    return <div>
        <img src={logo} style={{marginBottom: '16px'}} width="560px"></img>
        <div style={{paddingLeft: '20px'}}>
            <Typography.Title level={4}>欢迎进入示例页面</Typography.Title>
            <Typography.Title level={5}>关于系统</Typography.Title>
            {
                systemInfo.map(({ label, value }, index) => (
                    <div style={{marginBottom: '16px'}} key={index}>
                        <Typography.Text>{ label }：</Typography.Text>
                        <Typography.Text>{ value }</Typography.Text>
                    </div>
                ))
            }
        </div>
    </div>
}