import Store from 'electron-store';
import { BaseServices } from '@main/services/baseServices';
import { ipcMain } from 'electron';
import { STORE_SIGNAL } from '@publicEnum/store';

class LocalStore extends BaseServices<string> {
    store: Store
    constructor() {
        super();
        this.store = new Store();
        this.addListenIpcEvent();
    }
    protected addListenIpcEvent () {
        ipcMain.handle(STORE_SIGNAL.GET_VALUE, (event, [key, defaultValue] = []) => {
            return this.store.get(key, defaultValue);
        })

        ipcMain.handle(STORE_SIGNAL.SET_VALUE, (event, [key, value] = []) => {
            try{
                this.store.set(key, value);
            } catch(err) {
                console.error(`set value to store error key: ${key}, value: ${JSON.stringify(value)}, the error is ${err}`);
            }
        })
    }
}

export const store = new LocalStore
