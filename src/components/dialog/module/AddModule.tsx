import React from 'react';
import {ProForm, ModalForm, ProFormText} from '@ant-design/pro-components';
import useProjectStore from "@/store/project/useProjectStore";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";

export type AddModuleProps = {
  moduleDisable: boolean;
  trigger: string;

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
      title="新增模块"
      trigger={
        props.trigger === "bp" ?
          <Button icon={<PlusOutlined />}
                  type="text"
                  size={"small"}
                  disabled={props.moduleDisable}>新增模块</Button>
          : <Button type="primary">新增模块</Button>

      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await projectDispatch.addModule({
          ...emptyModule,
          name: values.name,
          chnname: values.chnname,
        });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText width="md"
                     name="name"
                     label="模块名「英文名」"
                     placeholder="请输入模块名"
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

export default React.memo(AddModule)
