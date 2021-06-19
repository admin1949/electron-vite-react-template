import { dialog, MenuItem, MenuItemConstructorOptions, Menu } from 'electron';
import { type, arch, release } from 'os';
import packageInfo from '../../../package.json';

type getArgType<T> = T extends (A: infer K) => any ? K : unknown;

export const menuConfig: getArgType<typeof Menu.buildFromTemplate> = [
    {
        label: '设置',
        submenu: [
            {
                label: '快速重启',
                accelerator: 'F5',
                role: 'reload'
            }, {
                label: '退出',
                accelerator: 'CmdOrCtrl+F4',
                role: 'close'
            }, {
                label: '帮助',
                submenu: [
                    {
                        label: '关于',
                        click: info,
                    }
                ]
            }
        ]
    }
];

function info() {
    dialog.showMessageBox({
        title: "关于",
        type: 'info',
        message: "electron",
        detail: `版本信息： ${packageInfo.version}\n引擎版本：${process.versions.v8}\n当前系统：${type()} ${arch()} ${release()}`,
        noLink: true,
        buttons: ['查看github', '确定'],
    })
}