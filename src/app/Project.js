import {Avatar, Card, List} from 'antd';
import React from 'react';
import './style/project.less';
import Meta from "antd/es/card/Meta";
import SettingOutlined from "@ant-design/icons/es/icons/SettingOutlined";
import EditOutlined from "@ant-design/icons/es/icons/EditOutlined";
import logo from './style/logo.png';
import ico from './style/favicon.ico';
import {Link} from "react-router-dom";
import ErdLayout from "./ErdLayout";
import request from "../utils/request";
import * as cache from "../utils/cache";

export default class Project extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request.post('/project/page', {
                data: {
                    page: this.state.page,
                    limit: this.state.limit
                }
            }
        ).then(res => {
            if (res) {
                this.setState({
                    data: res.records
                });
            }
        });
    };

    onSetting = (id) => {
        cache.setItem("projectId", id);
    }

    render() {
        const content =
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 4,
                    lg: 4,
                    xl: 6,
                    xxl: 3,
                }}
                pagination={{
                    onChange: page => {
                        console.log(page);
                    },
                    pageSize: 3,
                }}
                dataSource={this.state.data}
                footer={
                    <div>
                    </div>
                }
                renderItem={item => (
                    <List.Item
                        key={item.projectName}
                        bordered={true}
                        size="large"
                    >
                        <Card
                            cover={
                                <img
                                    alt="ERD-ONLINE"
                                    src={logo}
                                />
                            }
                            actions={[
                                <Link to="/loading" onClick={this.onSetting(item.id)}><SettingOutlined
                                    key="setting"/></Link>,
                                <EditOutlined key="edit"/>,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar
                                    src={ico}/>}
                                title={item.projectName}
                                description="在线多人协作数据库建模"
                            />
                        </Card>
                    </List.Item>
                )}
            />;
        return (
            <ErdLayout
                content={content}
                defaultSelectedKeys={['project']}
            />
        );
    }
}

