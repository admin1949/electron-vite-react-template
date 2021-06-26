export interface LoadingPageSate {
    isOpen: boolean;
    loading: boolean;
}

export enum LOADINGPAGE_ACTION_TYPE {
    'TOGGLE' = '@@loadingpage/TOGGLE',
    'INIT' = '@@loadingpage/INIT',
}
