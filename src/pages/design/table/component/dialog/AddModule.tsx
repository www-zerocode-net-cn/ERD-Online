import React from 'react';
import {Button} from "@blueprintjs/core";
import {message} from "antd";
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";

export type AddModuleProps = {
  moduleEditable: boolean;
};

const AddModule: React.FC<AddModuleProps> = (props) => {
  const projectDispatch = useProjectStore(state => state.dispatch);

  const emptyModule = {
    "name": "",
    "chnname": "",
    "entities": [],
    "graphCanvas": {
      "nodes": [],
      "edges": []
    },
    "associations": []
  }


  return (<>
    <ModalForm
      trigger={
        <Button icon="insert" text={"新建表"} small={true} disabled={props.moduleEditable}></Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        projectDispatch.addModule({
          ...emptyModule,
          name: values.name,
          chnname: values.chnname,
        });
        message.success('提交成功');
      }}
      submitter={{
        // 完全自定义整个区域
        // eslint-disable-next-line @typescript-eslint/no-shadow,
        render: (props, doms) => {
          console.log(props);
          return [
            <Button key="rest" icon="refresh" type="reset" onClick={() => props.form?.resetFields()}
                    text="重置"></Button>,
            <Button key="submit" type="submit" intent="primary" onClick={() => props.form?.submit?.()}
                    text="提交"></Button>,
          ];
        },
      }}
    >
      <ProForm.Group>
        <ProFormText width="md"
                     name="name"
                     label="表名"
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

export default React.memo(AddModule);
