import { STORE_SIGNAL, STORE_KEY } from "@publicEnum/store";
import { LOADINGPAGE_ACTION_TYPE } from "./type";

const { ipcRenderer } = require("electron") ;

export const createToggleLoadingPageAction = (newVal: boolean) => ({
    type: LOADINGPAGE_ACTION_TYPE.TOGGLE,
    payload: ipcRenderer.invoke(STORE_SIGNAL.SET_VALUE, [STORE_KEY.USE_LOADING_PAGE, newVal]).then(() => newVal),
});

export const createInitLoadingPageAction = () => ({
    type: LOADINGPAGE_ACTION_TYPE.INIT,
    payload: ipcRenderer.invoke(STORE_SIGNAL.GET_VALUE, [STORE_KEY.USE_LOADING_PAGE, true]) as Promise<boolean>,
})


type LoadingType<T> = { error: false, result: T, loading: false } | { loading: true } | { error: true, loading: false };
type WhitPromiseAction<T extends {type: string, payload: Promise<any>}> = T extends { type: infer T1, payload: Promise<infer P> } ? { type: T1, payload: LoadingType<P> } | T : unknown;

export type loadingPageAction = WhitPromiseAction<ReturnType<typeof createToggleLoadingPageAction>> | WhitPromiseAction<ReturnType<typeof createInitLoadingPageAction>>;