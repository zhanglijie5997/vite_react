import React, { memo, useState } from 'react'
import { Route, Switch, Link, RouteComponentProps } from "react-router-dom";

import page from '/@page/page';
import styles from "./router.module.scss";
import logo from "/@static/img/logo.png";
import { DownOutlined, EyeInvisibleOutlined, UserOutlined, LockOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, message, Modal } from "antd";
function Router(props: RouteComponentProps) {
    const [getNavList, setNavList] = useState([
        { name: "行情", id: 1,  children: [], link: "/"},
        { name: "现货交易", id: 2, children: [
            {name: "币币交易", id: 0},
            {name: "杠杆交易", id: 1},
        ] , link: ""},
        { name: "合约交易", id: 3, children: [
            {name: "交割合约", id: 0},
            {name: "币本位合约", id: 1},
            {name: "USDT本位合约", id: 2},
        ], link: "" },
    ]);

    const [getNavListActive, setNavListActive] = useState(1);

    const [getShowDropDown, setShowDropDown] = useState(1);

    /**
     * 修改nav索引
     * @param id 
     */
    const changeNavActive = (id: number) => {
        setNavListActive(id);
        setShowDropDown(id);
    }

    const goPath = (link: string) => link && props.history.push(link);

    // 导航菜单
    const navList = <ul className={styles.navList} >
        { 
            getNavList.map(_ => <li key={_.id}  onMouseEnter={() => changeNavActive(_.id)} className={styles.navListItem} onClick={() => changeNavActive(_.id)}>
                <span onClick={() => goPath(_.link)} className={`${getNavListActive === _.id ? styles.active : ''} ${styles.navListName}`}>{_.name}</span>
                { _.children.length > 0 ? <DownOutlined className={`${getNavListActive === _.id ? styles.active : ''} ${styles.downIcon}`} style={{ fontSize: "8px"}}/> : null}
                {
                    getShowDropDown === _.id && _.children.length > 0 ? <ul className={styles.navDropDown} onMouseLeave={() => setShowDropDown(-1)}>
                        {
                            _.children.map((e, index: number) => <li className={` ${styles.children}`} key={index}>{e.name}</li>)
                        }
                    </ul> : null
                }
            </li>)
        }
    </ul>

    const [getVisible, setVisible] = useState(false);

    // 登录-注册
    const registerLogin = <div className={styles.userBox}>
        <UserOutlined className={styles.userIcon}/>
        <span className={styles.loginText} onClick={() => setVisible(true)}>登录/注册</span>
    </div>

    const handleOk = () => {
        // setVisible(false);
    };

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.preventDefault();
        e.stopPropagation();
        setVisible(false);
    };

    const loginCallback = () => {
        message.success("登录成功");
        setVisible(false);
    }

    const [getShowPassword, setShowPassword] = useState(false);

    const modalRender = <div className={styles.modalContainer}>
        <p className={styles.modalLogin}>登录</p>
        <form className={styles.loginForm}>
            <div className={styles.username}>
                <label >用户名</label>
                <div className={styles.userNameContainer}>
                    <UserOutlined className={`${styles.active} ${styles.user}`}/>
                    <input type="text" />
                </div>
            </div>
            <div className={`${styles.username} ${styles.password}`}>
                <label >密码</label>
                <div className={`${styles.password} ${styles.userNameContainer}`}>
                    <div>
                        <LockOutlined className={`${styles.active} ${styles.user}`}/>
                        <input type={getShowPassword ? 'text' : 'password'} />
                    </div>
                    <div onClick={() => setShowPassword(!getShowPassword )}>
                        {
                            !getShowPassword ? <EyeInvisibleOutlined className={`${styles.eyes} ${styles.active} ${styles.user}`}/> : <EyeOutlined className={`${styles.eyes} ${styles.active} ${styles.user}`}/> 
                        }
                    </div>
                </div>
            </div>
            <Button onClick={loginCallback} className={styles.btn} type="default" block  size={'large'}>
                登录
            </Button>

            <div className={styles.foot}>
                <div className={styles.footLeft}>
                    <UserOutlined className={`${styles.gay} ${styles.user}`}/>
                    <p>&nbsp;&nbsp;没有账号？ <span className={`${styles.active}`}>去注册</span></p>
                </div>
                <div  className={`${styles.active} ${styles.footRight}`}>
                    ？忘记密码，找回密码
                </div>
            </div>
        </form>
    </div>

    return (
        <div>
            <nav className={styles.nav} onMouseLeave={() => setShowDropDown(-1)}>
                <div className={styles.left}>
                    <img src={logo} className={styles.logo} alt="" />
                    {navList}
                </div>
                { registerLogin }
                <Modal bodyStyle={{ borderRadius: "5px" }} closable={false} footer={null}
                       className={styles.modal}  visible={getVisible} onCancel={handleCancel}>
                    {modalRender}
                </Modal>
            </nav>
            <div className={styles.body}>
                <Switch>
                    {page.map((_, i: number) => <Route {..._} key={i}></Route>)}
                </Switch>
            </div>

        </div>
    )
}

export default memo(Router);
