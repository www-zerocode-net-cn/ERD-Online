import React from "react";
import {ProForm, ProFormText,ProFormSelect, ProFormTextArea} from '@ant-design/pro-components';
import {Divider, message, Space, Typography} from "antd";
import {get} from "@/services/crud";
import {useSearchParams} from "@@/exports";
import {updateProject} from "@/services/project";
import _ from "lodash";
import RemoveGroupProject from "@/pages/project/group/component/RemoveGroupProject";

const {Title, Text} = Typography;


export type BasicSettingProps = {};
const BasicSetting: React.FC<BasicSettingProps> = (props) => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || '';
  return (<>
    <ProForm
      onFinish={async (values) => {
        console.log(values);
        await updateProject({
          id: projectId,
          projectName: values.projectName,
          description: values.description,
          tags: _.join(values.tags, ',')
        }).then(r => {
          if (r.code === 200) {
            message.success('修改成功');
          } else {
            message.error(r.message || '修改失败')
          }
        })
      }}
      params={{id: '100'}}
      formKey="base-form-use-demo"
      dateFormatter={(value, valueType) => {
        console.log('---->', value, valueType);
        return value.format('YYYY/MM/DD HH:mm:ss');
      }}
      request={async (param) => {
        const result = await get('/ncnb/project/get/' + projectId, {});
        return result?.data
      }}
      autoFocusFirstInput
    >
      <Title level={4}>基本设置</Title>
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
                       tokenSeparators: [",",";"]
                     }}
      />
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
      <ProFormText width="md"
                   name="createTime"
                   label="创建时间"
                   fieldProps={{
                     bordered: false,
                     disabled: true,

                   }}
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
      <ProFormText width="md"
                   name="updateTime"
                   label="最后修改时间"
                   fieldProps={{
                     bordered: false,
                     disabled: true,

                   }}
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


    <Divider/>
    <Space direction="vertical">
      <Title level={4}>删除项目</Title>
      <Text type="secondary">删除项目全部模型，此操作无法恢复</Text>
      <RemoveGroupProject projectId={projectId}/>,
    </Space>
  </>);
};

export default React.memo(BasicSetting)
