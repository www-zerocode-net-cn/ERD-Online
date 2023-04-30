import React, {useRef} from "react";
import {ActionType, ProColumns, ProTable} from '@ant-design/pro-components';
import {GET} from "@/services/crud";
import PassApproval from "@/components/dialog/approval/PassApproval";
import RefuseApproval from "@/components/dialog/approval/RefuseApproval";
import {Modal} from "antd";
import CodeEditor from "@/components/CodeEditor";

export type ApprovalProps = {};
const Approval: React.FC<ApprovalProps> = (props) => {
  const actionRef = useRef<ActionType>();
  type ApprovalItem = {
    id: string;
    projectName: string;
    approveStatus: number;
    approveRemark: string;
    approveSql: string;
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
      dataIndex: 'approveRemark',
      width: 200,
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
      key: 'approveTime',
      width: 140,
      dataIndex: 'approveTime',
      search: false,
    },
    {
      title: '发起时间',
      key: 'createTime',
      dataIndex: 'createTime',
      search: false,
      width: 140,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 200,
      render: (text, record, _, action) => [
        record.approveStatus == 0 || record.approveStatus == 4 ?
          <>
            <PassApproval id={record.id} actionRef={actionRef}/>
            <RefuseApproval id={record.id} actionRef={actionRef}/>
          </> : '',
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
      request={
        async (params) => {
          const result = await GET('/ncnb/approval/approve', {
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
      toolBarRender={() => []}
    />
  </>);
};

export default React.memo(Approval)
