import {Card, Descriptions, Table} from 'antd';
import type {ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from "react";
import _ from "lodash";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";

export type TableListItem = {
  key: number;
  title: string;
  chnname: string;
};


export type ReverseTableProps = {};


const ReverseTable: React.FC<ReverseTableProps> = (props) => {
  const {projectDispatch, profileSliceState} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    profileSliceState: state.profileSliceState || {},
  }), shallow);
  const {data, exists,} = profileSliceState;
  const module = _.get(data, 'module', '');

  console.log('profileSliceState', profileSliceState);

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '表名「英文名」',
      width: 150,
      dataIndex: 'title',
      fixed: 'left',
      ellipsis: true,
      copyable: true,
      render: (_,entity) => {
        return <span style={{color: exists.includes(entity.title) ? 'red' : 'white'}}>{entity.title}</span>
      }
    },
    {
      title: '注释「中文名」',
      width: 150,
      dataIndex: 'chnname',
      align: 'left',
      ellipsis: true,
      search: false,
    }
  ];

  const tableListDataSource: TableListItem[] = [];

  module?.entities?.forEach((t: any) => {
    tableListDataSource.push({
      key: t.title,
      title: t.title,
      chnname: t.chnname,
    });
  });

  return (
    <ProTable<TableListItem>
      columns={columns}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(68, 'selectedRows', selectedRows);
          projectDispatch.saveSelectedRowKeys(selectedRowKeys);
        }
      }}

      tableExtraRender={(_, data1) => (
        <Card size="small">
          <Descriptions size="small" column={3}>
            <Descriptions.Item label="数据源">{projectDispatch.getCurrentDBName()}</Descriptions.Item>
            <Descriptions.Item label="解析表">{module.entities.length}</Descriptions.Item>
            <Descriptions.Item label="存量表" labelStyle={{color: "red"}}
                               contentStyle={{color: "red"}}>{exists.length}</Descriptions.Item>
          </Descriptions>
        </Card>
      )}
      dataSource={tableListDataSource}
      scroll={{y: 240}}
      options={false}
      search={false}
      rowKey="key"
    />
  );
};

export default React.memo(ReverseTable)
