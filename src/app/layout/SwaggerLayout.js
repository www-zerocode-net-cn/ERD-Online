import {Layout, Menu} from 'antd/lib/index';
import {createFromIconfontCN,} from '@ant-design/icons';
import React from "react";

import {HashRouter, Link} from 'react-router-dom';
import HeaderDropdown from "../container/HeaderDropdown";

import styles from '../style/erdlayout.less';
import UserOutlined from "@ant-design/icons/es/icons/UserOutlined";
import LogoutOutlined from "@ant-design/icons/es/icons/LogoutOutlined";
import Divider from "antd/es/divider/index";
import * as cache from "../../utils/cache";


import {createHashHistory} from 'history/index';
import GithubOutlined from "@ant-design/icons/es/icons/GithubOutlined";
import SettingOutlined from "@ant-design/icons/es/icons/SettingOutlined";
import {Image} from "antd";
// const history = createBrowserHistory() // history模式
const history = createHashHistory() // hash模式

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;


const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1485538_zhb6fnmux9a.js', // 在 iconfont.cn 上生成
});
export default class SwaggerLayout extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        this.setState({collapsed});
    };

    handleMenuClick = ({key}) => {
        if (key === 'logout') {
            cache.clear();
        }
    };


    render() {
        const {content, defaultSelectedKeys} = this.props;
        const {collapsed} = this.state;
        const username = cache.getItem("username");
        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.handleMenuClick}>
                <Menu.Item key="user">
                    <Link to="/user"><SettingOutlined/>系统设置</Link>
                </Menu.Item>
                <Menu.Item key="logout">
                    <Link to="/login"><LogoutOutlined/>退出登录</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <HashRouter>
                <Layout style={{minHeight: '100vh'}}>
                    <Layout className="site-layout">
                        <Header className="site-layout-background">
                            <div style={{textAlign: "left", marginLeft: "50px", height: "5px"}}>
                                <a href={"#/project"}>
                                    <Image
                                        preview={false}
                                        src={"favicon.ico"}>
                                    </Image>
                                </a>
                            </div>
                            <div style={{textAlign: "right"}}>
                                <Divider type="vertical"/>
                                <a href={"https://github.com/whaty/MARTIN-ERD"} target="_blank"
                                   title={"Github"}><GithubOutlined
                                    style={{margin: "10px"}}/></a>
                                <Divider type="vertical"/>
                                <a href='https://gitee.com/MARTIN-88/erd-online'><img
                                    src='https://gitee.com/MARTIN-88/erd-online/badge/star.svg?theme=dark'
                                    alt='star'></img></a>

                                <Divider type="vertical"/>
                                <HeaderDropdown overlay={menu}>
                                <span className={`${styles.action} ${styles.account}`}>
                                    <UserOutlined/>
                                    <span><b className={styles.username}>{username}</b></span>
                                </span>
                                </HeaderDropdown>
                            </div>
                        </Header>
                        <Content>
                            <div style={{height: "100%"}}>
                                {content}
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>ERD-ONLINE ©2020 Created by Martin</Footer>
                    </Layout>
                </Layout>
            </HashRouter>
        );
    }
}

