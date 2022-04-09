import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";

export type AddModuleProps = {
  moduleDisable: boolean;
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
        <Button icon="add"
                text={"新增模块"}
                minimal={true}
                small={true}
                fill={true}
                alignText={Alignment.LEFT}
                disabled={props.moduleDisable}></Button>
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
