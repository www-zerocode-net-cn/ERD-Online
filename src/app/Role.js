import React, {useContext, useEffect, useRef, useState} from 'react';
import {Button, Form, Input, Popconfirm, Table} from 'antd';
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
                width: '50%',
                editable: true,
            },
            {
                title: 'operation',
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
            limit: 3,
            page: 1,
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = () => {
        request.post('/sysRole/page', {
                data: {
                    page: this.state.page,
                    limit: this.state.limit
                }
            }
        ).then(res => {
            if (res) {
                this.setState({
                    dataSource: res.records
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
                this.fetchData();
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
                this.fetchData();
            }
        });
    };

    render() {
        const {dataSource} = this.state;
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
        const content = <div>
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

