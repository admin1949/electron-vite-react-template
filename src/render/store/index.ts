import { combineReducers, createStore, applyMiddleware, Middleware } from 'redux';
import {TypedUseSelectorHook, useSelector, useDispatch} from 'react-redux';
import isPromise from 'is-promise';
import { loadingPageReducer } from './loadingPage/reducer';
import { taryExitReducer } from './taryExit/reducer';


const reducer = combineReducers({
    loadingPage: loadingPageReducer,
    taryExit: taryExitReducer,
});

export const useTypedDispatch = () => useDispatch<typeof store.dispatch>();
export const useTypedSelector: TypedUseSelectorHook<ReturnType<typeof store.getState>> = useSelector;


const promiseLoadingMidderware: Middleware = ({ dispatch }) => {
    return next => action => {
        // 是标准的FSA, 判断是不是一个promise
        if (!isPromise(action.payload)) {
            return next(action);
        }
        dispatch({...action, payload: {loading: true}});
        return action.payload
            .then((result: any) => dispatch({ ...action, payload: { error: false, result, loading: false }}))
            .catch((error: any) => {
                dispatch({ ...action, payload: { error: true, loading: false }});
                return Promise.reject(error);
            })
    };
}
export const store = createStore(reducer, applyMiddleware(promiseLoadingMidderware));
