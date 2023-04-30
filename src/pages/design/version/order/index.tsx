import React, {useRef} from "react";
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {ProTable} from '@ant-design/pro-components';
import {Modal} from 'antd';
import {GET} from "@/services/crud";
import CancelApproval from "@/components/dialog/approval/CancelApproval";
import RepeatApproval from "@/components/dialog/approval/RepeatApproval";
import CodeEditor from "@/components/CodeEditor";

export type MyOrderProps = {};
const MyOrder: React.FC<MyOrderProps> = (props) => {
  const actionRef = useRef<ActionType>();

  type ApprovalItem = {
    id: string;
    projectName: string;
    approveStatus: number;
    approveRemark: string;
    approveResult: string;
    approveTime: string;
    createTime: string;
  };

  const columns: ProColumns<ApprovalItem>[] = [
    {
      dataIndex: 'id',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '项目事项',
      width: 200,
      dataIndex: 'approveRemark',
      copyable: true,
      ellipsis: true,
      search: false,
      tip: '项目事项过长会自动收缩',
    },
    {
      disable: true,
      title: '审批状态',
      width: 80,
      dataIndex: 'approveStatus',
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '待审批',
          status: 'Processing',
        },
        1: {
          text: '通过',
          status: 'Success',
        },
        2: {
          text: '撤销',
          status: 'Error',
        },
        3: {
          text: '拒绝',
          status: 'Error',
        },
        4: {
          text: '复批',
          status: 'Processing',
        },
      },
    },
    {
      disable: true,
      title: '审批反馈',
      width: 150,
      dataIndex: 'approveResult',
      search: false,
    },
    {
      title: '审批时间',
      width: 140,
      key: 'approveTime',
      dataIndex: 'approveTime',
      search: false,
    },
    {
      title: '发起时间',
      width: 140,
      key: 'createTime',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 200,
      key: 'option',
      fixed: 'right',
      render: (text, record, _, action) => [
        record.approveStatus == 0 ?
          <CancelApproval id={record.id} actionRef={actionRef}/> : '',
        record.approveStatus == 2 ?
          <RepeatApproval id={record.id} actionRef={actionRef}/> : '',
        <a key="view" onClick={() => Modal.info({
          title: 'sql明细',
          width: tempWidth * 0.5,
          content: (
            <>
              <CodeEditor
                mode='mysql'
                height={`${tempHeight * 0.5}px`}
                value={record.approveSql}
              />
            </>
          ),
        })}>
          查看
        </a>,
      ],
    },
  ];

  const height = document.body.clientHeight;
  const width = document.body.clientWidth;
  const tempHeight = height - 25;
  const tempWidth = width - 25;

  return (<>
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={
        async (params) => {
          const result = await GET('/ncnb/approval/promote', {
            ...params,
            size: params.pageSize,
          });
          return {
            data: result?.data?.records,
            total: result?.data?.total,
            success: result.code === 200
          }
        }
      }
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      headerTitle="我的工单"
      toolBarRender={() => [
        // <Button key="button" icon={<ConsoleSqlOutlined/>} type="primary">
        //   SQL审批
        // </Button>,
      ]}
    />
  </>);
};

export default React.memo(MyOrder)
