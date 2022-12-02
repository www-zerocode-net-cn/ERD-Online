import {ProColumns, ProTable, TableDropdown} from "@ant-design/pro-components";
import React, {useState} from "react";
import {Button, Tooltip} from "antd";
import {DownOutlined, QuestionCircleOutlined} from "@ant-design/icons";

export type QueryResultProps = {
  sqlInfo: string;
};

export type TableListItem = {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
};
const QueryResult: React.FC<QueryResultProps> = (props) => {

  const [queryResult,setQueryResult]=useState({
    sqlColumns: []
  });

  const getColumns = () => {
    return queryResult.sqlColumns.map(k => ({
      title: k,
      key: k,
      dataIndex: k,
      render: (text:any) => text === null ? <span style={{fontWeight: '100'}}>{"<null>"}</span> : text
    }))
  }

  const valueEnum = {
    0: 'close',
    1: 'running',
    2: 'online',
    3: 'error',
  };


  const tableListDataSource: TableListItem[] = [];

  const creators = ['付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某'];

  for (let i = 0; i < 5; i += 1) {
    tableListDataSource.push({
      key: i,
      name: 'AppName',
      containers: Math.floor(Math.random() * 20),
      creator: creators[Math.floor(Math.random() * creators.length)],
      status: valueEnum[Math.floor(Math.random() * 10) % 4],
      createdAt: Date.now() - Math.floor(Math.random() * 100000),
      memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案',
    });
  }

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '应用名称',
      width: 80,
      dataIndex: 'name',
      render: (_) => <a>{_}</a>,
    },
    {
      title: '容器数量',
      dataIndex: 'containers',
      align: 'right',
      sorter: (a, b) => a.containers - b.containers,
    },
    {
      title: '状态',
      width: 80,
      dataIndex: 'status',
      initialValue: 'all',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        close: { text: '关闭', status: 'Default' },
        running: { text: '运行中', status: 'Processing' },
        online: { text: '已上线', status: 'Success' },
        error: { text: '异常', status: 'Error' },
      },
    },
    {
      title: '创建者',
      width: 80,
      dataIndex: 'creator',
      valueEnum: {
        all: { text: '全部' },
        付小小: { text: '付小小' },
        曲丽丽: { text: '曲丽丽' },
        林东东: { text: '林东东' },
        陈帅帅: { text: '陈帅帅' },
        兼某某: { text: '兼某某' },
      },
    },
    {
      title: (
        <>
          创建时间
          <Tooltip placement="top" title="这是一段描述">
            <QuestionCircleOutlined style={{ marginInlineStart: 4 }} />
          </Tooltip>
        </>
      ),
      width: 140,
      key: 'since',
      dataIndex: 'createdAt',
      valueType: 'date',
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      ellipsis: true,
      copyable: true,
    },
  ];

  return (<>
    <ProTable<TableListItem>
      size={'small'}
      dataSource={tableListDataSource}
      rowKey="key"
      pagination={{
        showQuickJumper: true,
      }}
      columns={columns}
      search={false}
      options={false}
      dateFormatter="string"
    />
  </>);
};

export default React.memo(QueryResult)
