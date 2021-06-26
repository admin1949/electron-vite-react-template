/**
 * 主进程使用electron-store持久化数据
 * 使用规则: 主进程初始化store,
 * 渲染进程使用的数据只能使用ipc通知主进程修改数据, 主进程不能自己主动修改渲染进程的数据
 */

export enum STORE_SIGNAL {
    GET_VALUE = 'STORE_SIGNAL_GET_VALUE',
    SET_VALUE = 'STORE_SIGNAL_SET_VALUE',
    DELETE_VALUE = 'STORE_SIGNAL_DELETE_VALUE',
}

export enum STORE_KEY {
    USE_LOADING_PAGE = 'STORE_KEY_USE_LOADING_PAGE',
    USE_TARY_EXIT = 'STORE_KEY_USE_TARY_EXIT',
}