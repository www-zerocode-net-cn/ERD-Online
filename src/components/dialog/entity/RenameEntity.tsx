import React from 'react';
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-components';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {EditOutlined} from "@ant-design/icons";

export type RenameEntityProps = {
  moduleDisable: boolean;
  renameInfo: { title: string, chnname: string };
};

const RenameEntity: React.FC<RenameEntityProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <ModalForm
      title="重命名表"
      trigger={
        <Button icon={<EditOutlined />}
                type="text"
                size={"small"}
                disabled={props.moduleDisable}>重命名表</Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await projectDispatch.renameEntity({
          title: values.title,
          chnname: values.chnname,
        });
        return true;
      }}
      initialValues={props.renameInfo}
    >
      <ProForm.Group>
        <ProFormText width="md"
                     name="title"
                     label="表名「英文名」"
                     placeholder="请输入表名"
                     formItemProps={{
                       rules: [
                         {
                           required: true,
                           message: '不能为空',
                         },
                         {
                           max: 100,
                           message: '不能大于 100 个字符',
                         },
                       ],
                     }}
        />
        <ProFormText
          width="md"
          name="chnname"
          label="中文名称"
          placeholder="请输入中文名称"
          formItemProps={{
            rules: [
              {
                required: true,
                message: '不能为空',
              },
              {
                max: 100,
                message: '不能大于 100 个字符',
              },
            ],
          }}
        />
      </ProForm.Group>
    </ModalForm>
  </>);
}

export default React.memo(RenameEntity)
