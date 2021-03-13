import React from 'react'
import ReactDOM from 'react-dom'
// import styles from './index.module.scss';
import App from './App'
import "antd/dist/antd.css";
import { Provider } from "react-redux";
import store from './store';
import { createBrowserHistory } from 'history';
import { HashRouter } from 'react-router-dom';
import "/@static/css/reset.css";
const stores = store(createBrowserHistory());

ReactDOM.render(
    <Provider store={stores}>
        <HashRouter>
            <App />
        </HashRouter>
    </Provider>,
  document.getElementById('root')
)
