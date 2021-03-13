import React, { useEffect, useState } from 'react'
import './App.css'
import { message } from "antd";
import styles from "./index.module.scss";
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Router from './router/router';
function App(props: RouteComponentProps) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        message.success("success");
    }, [])
    return (
        <div className={styles.code}>
            <Router {...props}></Router>
        </div>
    )
}

export default withRouter(App);
