import { STORE_SIGNAL, STORE_KEY } from "@publicEnum/store";
import { TARY_EXIT_ACTION_TYPE } from "./type";

const { ipcRenderer } = require("electron") ;

export const createToggleTaryExitAction = (newVal: boolean) => ({
    type: TARY_EXIT_ACTION_TYPE.TOGGLE,
    payload: ipcRenderer.invoke(STORE_SIGNAL.SET_VALUE, [STORE_KEY.USE_TARY_EXIT, newVal]).then(() => newVal),
});

export const createInitTaryExitAction = () => ({
    type: TARY_EXIT_ACTION_TYPE.TOGGLE,
    payload: ipcRenderer.invoke(STORE_SIGNAL.GET_VALUE, [STORE_KEY.USE_TARY_EXIT, true]) as Promise<boolean>,
});


type LoadingType<T> = { error: false, result: T, loading: false } | { loading: true } | { error: true, loading: false };
type WhitPromiseAction<T extends {type: string, payload: Promise<any>}> = T extends { type: infer T1, payload: Promise<infer P> } ? { type: T1, payload: LoadingType<P> } | T : unknown;

export type loadingPageAction = WhitPromiseAction<ReturnType<typeof createToggleTaryExitAction>> | WhitPromiseAction<ReturnType<typeof createInitTaryExitAction>>;