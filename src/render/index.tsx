import React from "react";
import ReactDOM from "react-dom";
import '@render/assets/common.less';
import '@render/tools/update';
import { HashRouter as Router } from 'react-router-dom';
import { App } from '@render/App';

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <App></App>
        </Router>
    </React.StrictMode>,
    document.getElementById('app')
);