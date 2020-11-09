import {Avatar, Card, List, Space} from 'antd';
import React from 'react';
import * as reqwest from "reqwest";
import './style/project.less';
import Meta from "antd/es/card/Meta";
import SettingOutlined from "@ant-design/icons/es/icons/SettingOutlined";
import EditOutlined from "@ant-design/icons/es/icons/EditOutlined";
import logo from './style/logo.png';
import ico from './style/favicon.ico';
import {Link} from "react-router-dom";

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

const listData = [];
for (let i = 0; i < 23; i++) {
    listData.push({
        href: 'https://ant.design',
        title: `ant design part ${i}`,
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description:
            'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        content:
            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
}

const IconText = ({icon, text}) => (
    <Space>
        {React.createElement(icon)}
        {text}
    </Space>
);
export default class Project extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.fetchData(res => {
            this.setState({
                data: res.results,
            });
        });
    }

    fetchData = callback => {
        reqwest({
            url: fakeDataUrl,
            type: 'json',
            method: 'get',
            contentType: 'application/json',
            success: res => {
                callback(res);
            },
        });
    };


    render() {
        return (
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
                dataSource={listData}
                footer={
                    <div>
                    </div>
                }
                renderItem={item => (
                    <List.Item
                        key={item.title}
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
                                <Link to="/loading"><SettingOutlined key="setting"/></Link>,
                                <EditOutlined key="edit"/>,
                            ]}
                        >
                            <Meta
                                avatar={<Avatar
                                    src={ico}/>}
                                title={item.title}
                                description="在线多人协作数据库建模"
                            />
                        </Card>
                    </List.Item>
                )}
            />
        );
    }
}

