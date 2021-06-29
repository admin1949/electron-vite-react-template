const { arch, platform, release } = require('os');
import { useRouteMatch, useLocation } from 'react-router';

export const useSystemInfo = () => {
    const matcher = useRouteMatch();
    const location = useLocation();
    const info = [
        {
            label: '当前页面路径',
            value: location.pathname
        },
        {
            label: 'Electron版本',
            value: process.versions.electron
        },
        {
            label: 'Chromium版本',
            value: process.versions.chrome
        },
        {
            label: 'Node版本',
            value: process.versions.node
        },
        {
            label: '系统平台',
            value: platform()
        },
        {
            label: '系统版本',
            value: release(),
        },
        {
            label: '系统位数',
            value: `${arch()}位`
        },
    ]
    return info;
}