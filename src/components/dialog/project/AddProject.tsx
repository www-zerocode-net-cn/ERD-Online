import React from 'react';
import  {ProForm,ModalForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import useProjectStore from "@/store/project/useProjectStore";
import defaultData from "@/utils/defaultData.json";
import {Button} from "antd";
import _ from "lodash";

export type AddProjectProps = {
  fetchProjects: any;
  trigger: string;
  type: number;
};

const AddProject: React.FC<AddProjectProps> = (props) => {
  const projectDispatch = useProjectStore(state => state.dispatch);

  const emptyProject = {
    "projectName": "",
    "description": "",
    "tags": "",
    "projectJSON": {
      ...defaultData
    },
    "configJSON": {synchronous: {upgradeType: "increment"}},
  }

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (<>
    <ModalForm
      title="新增项目"
      trigger={
        <Button type="primary">新建</Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        projectDispatch.addProject({
          ...emptyProject,
          projectName: values.projectName,
          description: values.description,
          type: props.type,
          tags: _.join(values.tags, ',')
        }).then(() => {
          props.fetchProjects();
        });
        return true;
      }}
    >
      <ProForm>
        <ProFormText width="md"
                     name="projectName"
                     label="项目名"
                     placeholder="请输入项目名"
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
      </ProForm>
      <ProForm>
        <ProFormSelect width="md"
                       name="tags"
                       label="标签"
                       placeholder="请输入项目标签,按回车分割"
                       formItemProps={{
                         rules: [
                           {
                             required: true,
                             message: '不能为空',
                           },
                         ],
                       }}
                       fieldProps={{
                         mode: "tags",
                         onChange: handleChange,
                         tokenSeparators: [',']
                       }}
        />
      </ProForm>
      <ProFormTextArea
        width="md"
        name="description"
        label="项目描述"
        placeholder="请输入项目描述"
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
    </ModalForm>
  </>);
}

export default React.memo(AddProject)
