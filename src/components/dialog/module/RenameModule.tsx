import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import ProForm, {ModalForm, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";

export type RenameModuleProps = {
  moduleDisable: boolean;
  renameInfo: { name: string, chnname: string };
};

const RenameModule: React.FC<RenameModuleProps> = (props) => {
  const projectDispatch = useProjectStore(state => state.dispatch);

  return (<>
    <ModalForm
      title="重命名模块"
      trigger={
        <Button icon="edit"
                text={"重命名模块"}
                minimal={true}
                small={true}
                fill={true}
                alignText={Alignment.LEFT}
                disabled={props.moduleDisable}></Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await projectDispatch.renameModule({
          name: values.name,
          chnname: values.chnname,
        });
      }}
      initialValues={props.renameInfo}
    >
      <ProForm.Group>
        <ProFormText width="md"
                     name="name"
                     label="模块名「英文名」"
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

export default React.memo(RenameModule)
