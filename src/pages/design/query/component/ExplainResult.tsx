import {ProTable} from "@ant-design/pro-components";
import React from "react";

export type ExplainResultProps = {
  tableResult: { columns: any, dataSource: any, total: number };
};


const ExplainResult: React.FC<ExplainResultProps> = (props) => {


  const getColumns = () => {
    return props.tableResult.columns.map((k: any) => ({
      title: k,
      key: k,
      dataIndex: k,
      ellipsis: true,
      width: 150,
      render: (text: any) => text === null ? <span style={{fontWeight: '100'}}>{"<null>"}</span> : text
    }))
  }

  return (<>
    <ProTable
      size={'small'}
      scroll={{ x: 1300 }}
      dataSource={props.tableResult.dataSource}
      rowKey="id"
      pagination={{
        showQuickJumper: true,
        total: props.tableResult.total
      }}
      columns={getColumns()}
      search={false}
      options={false}
      dateFormatter="string"
    />
  </>);
};

export default React.memo(ExplainResult)
