import React from "react";
import {PlusOutlined} from '@ant-design/icons';
import {ModalForm, ProForm, ProFormSelect,} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import {get, post} from "@/services/crud";

export type AddUserProps = {
  roleId: string;
  actionRef: any;
};
const AddUser: React.FC<AddUserProps> = (props) => {
  return (<>
    <ModalForm
      title="添加成员"
      trigger={
        <Button key="add-user" type="primary">
          <PlusOutlined/>
          添加成员
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
        await post('/ncnb/project/role/users', {
          roleId: props.roleId,
          userIds: values.user,
        }).then((resp) => {
          console.log(34, props.actionRef);
          if (resp?.code === 200) {
            message.success("保存成功");
            props.actionRef.current?.reload();
          }
        });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="user"
          label="选择用户"
          mode="multiple"
          showSearch
          request={
            async (param) => {
              const result = await get('/ncnb/project/users', {
                pageSize: 6,
                current: 1,
                username: param.keyWords,
                roleId: props.roleId
              });
              return result?.data?.records.map((m: { id: any; username: any; email: any; }) => {
                return {
                  value: m.id,
                  label: `${m.username}  -  ${m.email}`
                }
              })

            }
          }
          placeholder="添加用户"
          rules={[{required: true, message: '请选择用户'}]}
        />
      </ProForm.Group>
    </ModalForm></>);
};

export default React.memo(AddUser)
