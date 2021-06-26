export interface TaryExitSate {
    isOpen: boolean;
    loading: boolean;
}

export enum TARY_EXIT_ACTION_TYPE {
    'TOGGLE' = '@@taryExit/TOGGLE',
    'INIT' = '@@taryExit/init',
}
