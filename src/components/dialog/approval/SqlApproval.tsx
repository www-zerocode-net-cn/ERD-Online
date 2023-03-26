import React from "react";
import {ConsoleSqlOutlined} from '@ant-design/icons';
import {ModalForm, ProFormSelect, ProFormTextArea,} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import {GET, POST} from "@/services/crud";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import _ from "lodash";
import useProjectStore from "@/store/project/useProjectStore";
import {compareStringVersion} from "@/utils/string";

export type SqlApprovalProps = {
  projectId: string;
  approveSql: string;
  versionId: string;
  display: string;
};
const SqlApproval: React.FC<SqlApprovalProps> = (props) => {
  const {dbs} = useVersionStore(state => ({
    dbs: state.dbs,
  }), shallow);

  const groupDb = _.groupBy(dbs, g => g.select);
  const options = Object.keys(groupDb).map(m => {
    console.log(267, m, groupDb[m]);
    return {
      label: m,
      options: groupDb[m].map(
        m1 => {
          return {
            label: m1.name,
            value: m1.name
          }
        }
      )
    }
  });
  return (<>
    <ModalForm
      key="approval"
      title='发起SQL审批'
      trigger={
        <Button
          key="approval"
          type="primary"
          style={{
            display: props.display
          }}
        >
          <ConsoleSqlOutlined/>
          SQL审批
        </Button>
      }
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      submitter={{
        resetButtonProps: {
          type: 'dashed',
        },
      }}
      submitTimeout={2000}
      onFinish={async (values: any) => {
        console.log(values.user);
        const db = dbs?.filter((d: any) => d.name === values.dbInfo)[0];
        const dbConfig = _.omit(db.properties, ['driver_class_name']);
        const params = {
          ...dbConfig,
          driverClassName: db.properties['driver_class_name'],
        }
        await POST('/ncnb/approval', {
          projectId: props.projectId,
          approver: values.approver,
          versionId: props.versionId,
          approveRemark: values.approveRemark,
          dbInfo: JSON.stringify(params) || '',
          approveSql: props.approveSql,
        }).then((resp) => {
          if (resp?.code === 200) {
            message.success("保存成功");
          }
        });
        return true;
      }}
        >
        <ProFormSelect
        width="md"
        name="approver"
        label="审批人"
        showSearch
        request={
        async (param) => {
        const result = await GET('/ncnb/project/group/approval/users', {
        projectId: props.projectId,
      });
        return result?.data?.map((m: {id: any; username: any; email: any;}) => {
        return {
        value: m.id,
        label: `${m.username}  -  ${m.email}`
      }
      })

      }
      }
        placeholder="审批人"
        rules={[{required: true, message: '请输入审批人'}]}
        />
        <ProFormSelect
        name="dbInfo"
        width="md"
        label="目标数据库"
        options={options}
        placeholder="请选择目标数据库"
        rules={[{required: true, message: '选择一个目标数据库!'}]}
        />
        <ProFormTextArea
        width="md"
        name="approveRemark"
        label="审批说明"
        placeholder="审批说明，不少于5个字"
        formItemProps={{
        rules: [
      {
        required: true,
        message: '不能为空',
      },
      {
        min: 5,
        max: 500,
        message: '只能输入5~500 个字符',
      },
        ],
      }}
        />
        </ModalForm></>);
      };

export default React.memo(SqlApproval)
