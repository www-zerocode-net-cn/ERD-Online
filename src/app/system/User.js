import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Dropdown, Form, Input, Menu, Pagination, Popconfirm, Table} from 'antd/lib/index';
import request from "../../utils/request";
import {v4 as uuidv4} from 'uuid';
import ErdLayout from "../layout/ErdLayout";
import DownOutlined from "@ant-design/icons/es/icons/DownOutlined";
import UserOutlined from "@ant-design/icons/es/icons/UserOutlined";


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


export default class User extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: '30%',
                editable: true,
            },
            {
                title: '密码(密码前面必须带着{noop})',
                dataIndex: 'password',
                editable: true,
            },
            {
                title: '角色',
                dataIndex: 'bindRole',
                render: (text, record) =>
                    this.state.roles.length >= 1 ? (
                        <Dropdown overlay={this.getMenus(record)} trigger={['click']}>
                            <Button>
                                {text} <DownOutlined/>
                            </Button>
                        </Dropdown>
                    ) : null,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <>
                            <Popconfirm title="确认删除?" okText={"删除"} cancelText={"取消"}
                                        onConfirm={() => this.handleDelete(record)}>
                                <a href={"###"}>删除</a>
                            </Popconfirm>

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
            roles: [],
            currentRole: '',
            visible: false
        };
    }

    componentDidMount() {
        this.fetchData(this.state.current, this.state.pageSize);
        this.fetchRole();
    }

    getMenus = (record) => {
        const roles = this.state.roles;
        const map = roles.map(item => {
            return (<Menu.Item key={item.id} icon={<UserOutlined/>}
                               onClick={() => this.handleMenuClick(item.id, record)}> {item.name}</Menu.Item>);
        });
        return <Menu>{map}</Menu>;
    }

    handleMenuClick = (roleId, record) => {
        console.log('click', record);
        request.post('/sysUser/bindRole', {
                data: {
                    userId: record.id,
                    roleId: roleId
                }
            }
        ).then(res => {
            if (res) {
                this.fetchData(this.state.current, this.state.pageSize);
            }
        });
    }

    fetchRole = () => {
        request.post('/sysRole/all', {
                data: {}
            }
        ).then(res => {
            if (res) {
                console.log(res)
                this.setState({
                    roles: res.roles,
                    currentRole: res.currentRole,
                });
            }
        });
    }

    fetchData = (current, size) => {
        request.post('/sysUser/page', {
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
        request.post('/sysUser/delete', {
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
            username: `erd`,
            password: '{noop}erd',
        };
        request.post('/sysUser/add', {
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
        request.post('/sysUser/update', {
                data: row
            }
        ).then(res => {
            if (res) {
                this.fetchData(this.state.current, this.state.pageSize);
            }
        });
    };

    onChange = (page, pageSize) => {
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
        const content = <div key={"user"}>
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
                onChange={this.onChange}
                showTotal={total => `共 ${total} 条`}
            />
        </div>;
        return (
            <ErdLayout
                content={content}
                defaultSelectedKeys={['user']}
            />
        );
    }
}

