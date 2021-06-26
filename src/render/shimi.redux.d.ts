import { Dispatch } from 'redux';

declare module 'redux' {
    type PromiseAction<T = any> = {
        type: string;
        payload: Promise<T>
    }
    export interface Dispatch<A> {
        <R>(action: PromiseAction<R>): Promise<R>
    }
}
