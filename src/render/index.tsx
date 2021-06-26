import React, { createContext } from "react";
import ReactDOM from "react-dom";
import '@render/assets/common.less';
import { HashRouter as Router } from 'react-router-dom';
import { App } from '@render/App';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/nord.css';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
        <Router>
            <App></App>
        </Router>
        </Provider>
    </React.StrictMode>,
    document.getElementById('app')
);