import React from "react";
import {ProForm, ProFormText,} from '@ant-design/pro-components';
import {Divider, message, Space, Typography} from "antd";
import {ProFormSelect, ProFormTextArea} from "@ant-design/pro-form";
import RemoveProject from "@/components/dialog/project/RemoveProject";

const {Title, Text} = Typography;


export type BasicSettingProps = {};
const BasicSetting: React.FC<BasicSettingProps> = (props) => {
  return (<>
    <ProForm
      onFinish={async (values) => {
        console.log(values);
        message.success('提交成功');
      }}
      params={{id: '100'}}
      formKey="base-form-use-demo"
      dateFormatter={(value, valueType) => {
        console.log('---->', value, valueType);
        return value.format('YYYY/MM/DD HH:mm:ss');
      }}
      request={async () => {
        return {
          name: '蚂蚁设计有限公司',
          useMode: 'chapter',
        };
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
                       tokenSeparators: [',']
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
    </ProForm>


    <Divider/>
    <Space direction="vertical">

      <Title level={4}>删除项目</Title>
      <Text type="secondary">删除项目全部模型，此操作无法恢复</Text>
      <RemoveProject />,
    </Space>
  </>);
};

export default React.memo(BasicSetting)
