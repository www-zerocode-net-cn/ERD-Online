import React from 'react';
import ProForm, {ModalForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import {Button} from "antd";
import {updateProject} from "@/services/project";
import _ from "lodash";

export type RenameProjectProps = {
  fetchProjects: any;
  trigger: string;
  project: any;
};

const RenameProject: React.FC<RenameProjectProps> = (props) => {
  return (<>
    <ModalForm
      title="修改项目"
      trigger={
        <Button type="link">修改</Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        updateProject({
          id: props.project.id,
          projectName: values.projectName,
          description: values.description,
          tags: _.join(values.tags, ',')
        }).then(() => {
          props.fetchProjects();
        });
        return true;
      }}
      initialValues={props.project}

    >
      <ProForm.Group>
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
      </ProForm.Group>
      <ProForm.Group>
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
                         tokenSeparators: [',']
                       }}
        />
      </ProForm.Group>
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

export default React.memo(RenameProject)
