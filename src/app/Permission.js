import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, Pagination, Popconfirm, Table} from 'antd';
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

export default class Permission extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '权限名',
                dataIndex: 'name',
                width: '25%',
                editable: true,
            }, {
                title: '描述',
                dataIndex: 'description',
                width: '25%',
                editable: true,
            }, {
                title: 'url',
                dataIndex: 'url',
                width: '25%',
                editable: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <Popconfirm title="确认删除?" okText={"删除"} cancelText={"取消"}
                                    onConfirm={() => this.handleDelete(record)}>
                            <a href={"###"}>删除</a>
                        </Popconfirm>
                    ) : null,
            },
        ];
        this.state = {
            dataSource: [],
            count: 2,
            current: 1,
            pageSize: 10,
            total: 0
        };
    }

    componentDidMount() {
        this.fetchData(this.state.current, this.state.pageSize);
    }

    fetchData = (current, size) => {
        request.post('/sysPermission/page', {
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
        request.post('/sysPermission/delete', {
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
            name: `ERD`,
            description: 'ERD',
            url: 'ERD'
        };
        request.post('/sysPermission/add', {
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
        request.post('/sysPermission/update', {
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
        const content =
            <div key={"permission"}>
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
                defaultSelectedKeys={['permission']}
            />
        );
    }
}

