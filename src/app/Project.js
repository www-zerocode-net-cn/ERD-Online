import {
    Avatar,
    Button,
    Card,
    Col,
    Form,
    Image,
    Input,
    List,
    Modal,
    notification,
    Popconfirm,
    Row,
    Typography
} from 'antd';
import React from 'react';
import styles from './style/project.less';
import ErdLayout from "./ErdLayout";
import request from "../utils/request";
import * as cache from "../utils/cache";
import PlusOutlined from "@ant-design/icons/es/icons/PlusOutlined";
import logo from './style/logo.png';
import project from './style/project.png';
import {Link} from "react-router-dom";
import EditOutlined from "@ant-design/icons/es/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/es/icons/DeleteOutlined";


const {Paragraph} = Typography;

export default class Project extends React.Component {
    state = {
        data: [],
        loading: false,
        hasMore: true,
        visible: false,
        id: '',
        projectName: '',
        description: '',
        modalName: ''
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
                if (res.records) {
                    this.setState({
                        data: res.records
                    });
                } else {
                    notification.error({
                        message: '获取项目信息失败',
                    });
                }
            }
        });
    };

    onSetting = (id) => {
        console.log('=====', id)
        cache.setItem("projectId", id);
    }

    modifyProject(item) {
        this.setState({
            visible: true,
            modalName: '修改项目',
            projectName: item.projectName,
            description: item.description,
            id: item.id
        });
    }

    handleDelete(item) {
        request.post('/project/delete', {
                data: {
                    id: item.id,
                }
            }
        ).then(res => {
            if (res) {
                notification.info({
                    message: '删除成功',
                });
                this.fetchData();
            }
        });

    }


    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    hideModal = () => {
        this.setState({
            visible: false,
            projectName: '',
            description: '',
            id: ''
        });
    }

    addProject = () => {
        this.setState({
            visible: true,
            modalName: '新建项目'
        });
    };


    saveProject = () => {
        const {id, projectName, description} = this.state;
        if (id) {
            request.post('/project/update', {
                    data: {
                        id: id,
                        projectName: projectName,
                        description: description
                    }
                }
            ).then(res => {
                if (res) {
                    notification.info({
                        message: '修改成功',
                    });
                    this.setState({
                        visible: false,
                    });
                    this.fetchData();
                }
            });
        } else {
            request.post('/project/save', {
                    data: {
                        projectName: projectName,
                        description: description
                    }
                }
            ).then(res => {
                if (res) {
                    notification.info({
                        message: '新增成功',
                    });
                    this.setState({
                        visible: false,
                    });
                    this.fetchData();
                }
            });
        }

    };

    onProjectNameChange = (e) => {
        this.setState({
            projectName: e.target.value
        });
    }

    onDescriptionChange = (e) => {
        this.setState({
            description: e.target.value
        });
    }

    render() {
        let dataSource = this.state.data;
        const content =
            <div className={styles.cardList}>
                <List
                    rowKey="id"
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
                        pageSize: 6,
                    }}
                    dataSource={[{}, ...dataSource]}
                    footer={
                        <div>
                        </div>
                    }
                    renderItem={item => (item && item.id) ? (

                        <List.Item
                            key={item.id}
                        >
                            <Card
                                hoverable
                                className={styles.card}
                                actions={[
                                    <EditOutlined onClick={() => {
                                        this.modifyProject(item)
                                    }}/>,
                                    <Popconfirm title="确认删除?" okText={"删除"} cancelText={"取消"}
                                                onConfirm={() => this.handleDelete(item)}>
                                        < DeleteOutlined/>
                                    </Popconfirm>
                                ]}

                            >
                                <Card.Meta
                                    avatar={<Avatar
                                        src={<Image
                                            src={logo}/>}
                                    />}
                                    title={<a onClick={() => this.modifyProject(item)}>{item.projectName}</a>}
                                    description={
                                        <Link to="/loading" onClick={() => this.onSetting(item.id)}
                                              title={"开始数据库设计"}>
                                            <Paragraph className={styles.item} ellipsis={{rows: 3}}>
                                                <Row>
                                                    <Col span={12}>
                                                        {item.description}
                                                    </Col>
                                                    <Col span={12}>
                                                        <img
                                                            width={272}
                                                            alt="logo"
                                                            src={project}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Paragraph>
                                        </Link>
                                    }
                                />
                            </Card>
                        </List.Item>
                    ) : (
                        <List.Item>
                            <Button type="dashed" block className={styles.newButton} onClick={this.addProject}
                                    style={{height: "305px"}}>
                                <PlusOutlined/> 新建项目
                            </Button>
                        </List.Item>
                    )}
                />
                <Modal
                    title={this.state.modalName}
                    visible={this.state.visible}
                    onOk={this.saveProject}
                    onCancel={this.hideModal}
                    okText="确认"
                    cancelText="取消"

                >
                    <Form>
                        <Form.Item label="名称">
                            <Input
                                placeholder="ERD-ONLINE"
                                value={this.state.projectName}
                                onChange={(e) => this.onProjectNameChange(e)}
                            />
                        </Form.Item>
                        <Form.Item label="描述">
                            <Input.TextArea
                                placeholder="在线多人协作数据库建模"
                                value={this.state.description}
                                onChange={(e) => this.onDescriptionChange(e)}
                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>;
        return (
            <ErdLayout
                content={content}
                defaultSelectedKeys={['project']}
            />
        );
    }


}

