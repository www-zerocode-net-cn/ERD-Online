import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";

export type AddEntityProps = {
  moduleDisable: boolean;
};

const AddEntity: React.FC<AddEntityProps> = (props) => {
  const {projectDispatch, currentModuleIndex} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    currentModuleIndex: state.currentModuleIndex || -1
  }), shallow);

  console.log('currentModuleIndex', 21, currentModuleIndex);


  const emptyEntity = {
    "title": "",
    "fields": projectDispatch.getDefaultFields() || [],
    "indexs": [],
    "headers": [],
    "chnname": ""
  }


  return (<>
    <ModalForm
      title="新建表"
      trigger={
        <Button icon="add"
                text={"新建表"}
                minimal={true}
                small={true}
                fill={true}
                alignText={Alignment.LEFT}
                disabled={props.moduleDisable}></Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await projectDispatch.addEntity({
          ...emptyEntity,
          title: values.title,
          chnname: values.chnname,
        });
        return true
      }}
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

export default React.memo(AddEntity)
