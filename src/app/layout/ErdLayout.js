import {Col, Layout, Menu, Row} from 'antd/lib/index';
import {createFromIconfontCN, PieChartOutlined,} from '@ant-design/icons';
import React from "react";

import {HashRouter, Link} from 'react-router-dom';
import HeaderDropdown from "../container/HeaderDropdown";

import styles from '../style/erdlayout.less';
import UserOutlined from "@ant-design/icons/es/icons/UserOutlined";
import LogoutOutlined from "@ant-design/icons/es/icons/LogoutOutlined";
import Divider from "antd/es/divider/index";
import TeamOutlined from "@ant-design/icons/es/icons/TeamOutlined";
import HomeOutlined from "@ant-design/icons/es/icons/HomeOutlined";
import SolutionOutlined from "@ant-design/icons/es/icons/SolutionOutlined";
import * as cache from "../../utils/cache";


import {createHashHistory} from 'history/index';
import GithubOutlined from "@ant-design/icons/es/icons/GithubOutlined";
// const history = createBrowserHistory() // history模式
const history = createHashHistory() // hash模式

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;


const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1485538_aadddrmj2oj.js', // 在 iconfont.cn 上生成
});
export default class ErdLayout extends React.Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
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
                <Menu.Divider/>
                <Menu.Item key="logout">
                    <Link to="/login"><LogoutOutlined/>退出登录</Link>
                </Menu.Item>
            </Menu>
        );
        return (
            <HashRouter>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                        <Row style={{margin: "30 30"}}>
                            <Col span={12}> <Link to="/login"><span className="logo"/></Link></Col>
                            <Col span={12} style={{verticalAlign: "middle"}}><span
                                className="erd_title">ERD-ONLINE</span></Col>
                        </Row>
                        <Menu theme="dark" defaultSelectedKeys={defaultSelectedKeys} defaultOpenKeys={['system']}
                              mode="inline">
                            <Menu.Item key="project" icon={<HomeOutlined/>}>
                                <Link to="/project">项目</Link>
                            </Menu.Item>
                            <SubMenu key="system" icon={<PieChartOutlined/>} title="系统管理">
                                <Menu.Item key="user"><Link to="/user"><UserOutlined/>用户</Link></Menu.Item>
                                <Menu.Item key="role"><Link to="/role"><TeamOutlined/>角色</Link></Menu.Item>
                                <Menu.Item key="permission"><Link
                                    to="/permission"><SolutionOutlined/>权限</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Layout className="site-layout">
                        <Header className="site-layout-background">
                            <div style={{textAlign: "right"}}>
                                <Divider type="vertical"/>
                                <a href={"https://github.com/whaty/MARTIN-ERD"} target="_blank"
                                   title={"Github"}><GithubOutlined
                                    style={{margin: "10px"}}/></a>
                                <Divider type="vertical"/>
                                <a href={"https://gitee.com/MARTIN-88/erd-online"} target="_blank" title={"Gitee"}>
                                    <MyIcon type="icon-gitee" style={{margin: "10px"}}/>
                                </a>

                                <Divider type="vertical"/>
                                <HeaderDropdown overlay={menu}>
                                <span className={`${styles.action} ${styles.account}`}>
                                    <UserOutlined/>
                                    <span><b>{username}</b></span>
                                </span>
                                </HeaderDropdown>
                            </div>
                        </Header>
                        <Content>
                            <div style={{margin: "20px 20px", height: "100%"}}>
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

