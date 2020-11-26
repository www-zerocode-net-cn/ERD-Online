import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    Button,
    Checkbox,
    Col,
    Divider,
    Form,
    Input,
    Modal,
    notification,
    Pagination,
    Popconfirm,
    Row,
    Table
} from 'antd';
import request from "../utils/request";
import {v4 as uuidv4} from 'uuid';
import ErdLayout from "./ErdLayout";


const EditableContext = React.createContext();

const EditableRow = ({index, ...props}) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
                          title,
                          editable,
                          children,
                          dataIndex,
                          record,
                          handleSave,
                          ...restProps
                      }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async (e) => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({...record, ...values});
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save}/>
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td {...restProps}>{childNode}</td>;
};

export default class Role extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '角色名',
                dataIndex: 'name',
                key: 'name',
                width: '50%',
                editable: true,
            },
            {
                title: '操作',
                key: 'operation',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <>
                            <Popconfirm title="确认删除?" okText={"删除"} cancelText={"取消"}
                                        onConfirm={() => this.handleDelete(record)}>
                                <a href={"###"}>删除</a>
                            </Popconfirm>
                            <Divider type="vertical"/>
                            <a onClick={() => this.fetchPermission(record)}>权限</a>
                            <Modal
                                title="授权"
                                visible={this.state.visible}
                                onOk={this.savePermission}
                                onCancel={this.hideModal}
                                okText="确认"
                                cancelText="取消"
                            >
                                <Checkbox.Group style={{width: '100%'}} onChange={this.onPermissionChange} value={this.state.checkedPermissions}>
                                    <Row>
                                        {
                                            this.state.allPermissions && this.state.allPermissions.map(item => (
                                                <Col span={12}>
                                                    <Checkbox
                                                        value={item.id}
                                                    >
                                                        {item.name}
                                                    </Checkbox>
                                                </Col>
                                            ))
                                        }
                                    </Row>
                                    <>
                                    </>
                                </Checkbox.Group>
                            </Modal>
                        </>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: [],
            count: 2,
            current: 1,
            pageSize: 3,
            total: 0,
            visible: false,
            allPermissions: [],
            checkedPermissions: [],

        };
    }


    onPermissionChange = (checkedValues) => {
        console.log(checkedValues)
        this.setState({
            checkedPermissions: checkedValues
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
        });
    };


    savePermission = () => {
        request.post('/sysRole/savePermission', {
                data: {
                    roleId: this.state.roleId,
                    checkedPermissions: this.state.checkedPermissions
                }
            }
        ).then(res => {
            if (res) {
                notification['success']({
                    message: '',
                    description:
                        '保存权限成功',
                });
                this.hideModal();
            }
        });
    };


    componentDidMount() {
        this.fetchData(this.state.current, this.state.pageSize);
    }

    fetchPermission = (record) => {
        this.setState({
            roleId:record.id
        });
        request.post('/sysPermission/fetchPermission', {
                data: {
                    roleId: record.id
                }
            }
        ).then(res => {
            if (res) {
                console.log(res.checkedPermissions.map(item=>(item.id)))
                this.setState({
                    allPermissions: res.allPermissions,
                    checkedPermissions: res.checkedPermissions.map(item=>(item.id)),
                });
                this.showModal();
            }
        });
    }

    fetchData = (current, size) => {
        request.post('/sysRole/page', {
                data: {
                    current: current,
                    size: size
                }
            }
        ).then(res => {
            if (res) {
                this.setState({
                    dataSource: res.records,
                    current: res.current,
                    total: res.total
                });
            }
        });
    };

    handleDelete = (record) => {
        request.post('/sysRole/delete', {
                data: record
            }
        ).then(res => {
            if (res) {
                this.fetchData(this.state.current, this.state.pageSize);
            }
        });

    };
    handleAdd = () => {
        const {dataSource} = this.state;
        const newData = {
            id: uuidv4(),
            name: `erd`,
        };
        request.post('/sysRole/add', {
                data: newData
            }
        ).then(res => {
            if (res) {
                this.setState({
                    dataSource: [...dataSource, newData],
                });
            }
        });

    };
    handleSave = (row) => {
        request.post('/sysRole/update', {
                data: row
            }
        ).then(res => {
            if (res) {
                this.fetchData(this.state.current, this.state.pageSize);
            }
        });
    };

    onPageChange = (page, pageSize) => {
        this.setState({
            current: page
        });
        this.fetchData(page, this.state.pageSize);
    }

    render() {
        const {dataSource, current, total, pageSize} = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: (record) => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave,
                }),
            };
        });
        const content = <div key={"role"}>
            <Button
                onClick={this.handleAdd}
                type="primary"
                style={{
                    marginBottom: 16,
                }}
            >
                新增
            </Button>
            <Table
                components={components}
                rowClassName={() => 'editable-row'}
                bordered
                dataSource={dataSource}
                columns={columns}
                pagination={false}
            />
            <Pagination
                total={total}
                current={current}
                pageSize={pageSize}
                onChange={this.onPageChange}
                showTotal={total => `共 ${total} 条`}
            />
        </div>;

        return (
            <ErdLayout
                content={content}
                defaultSelectedKeys={['role']}
            />
        );
    }
}

