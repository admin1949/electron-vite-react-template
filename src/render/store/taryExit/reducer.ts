import { TaryExitSate, TARY_EXIT_ACTION_TYPE } from "./type";
import { loadingPageAction } from './actions';
import { Reducer } from "redux";
import isPromise from 'is-promise';

const loadingPageInitState: TaryExitSate = {
    isOpen: true,
    loading: false,
}

const reducer: Reducer<TaryExitSate, loadingPageAction> = (state = loadingPageInitState, { type, payload }) => {
    switch(type) {
        case TARY_EXIT_ACTION_TYPE.TOGGLE:
        case TARY_EXIT_ACTION_TYPE.INIT:
            if (isPromise(payload)) {
                return state;
            }
            if (payload.loading) {
                return {
                    ...state,
                    loading: payload.loading
                }
            }
            if (payload.error) {
                return {
                    ...state,
                    loading: payload.loading
                }
            }
            return {
                ...state,
                loading: payload.loading,
                isOpen: payload.result
            }
        default:
            return state;
    }
}

export { reducer as taryExitReducer };