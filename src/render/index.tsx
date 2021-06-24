import React, { createContext } from "react";
import ReactDOM from "react-dom";
import '@render/assets/common.less';
import { HashRouter as Router } from 'react-router-dom';
import { App } from '@render/App';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/nord.css';


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <App></App>
        </Router>
    </React.StrictMode>,
    document.getElementById('app')
);