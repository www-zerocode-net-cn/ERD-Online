import React from 'react';
import {ModalForm, ProFormSelect, ProFormText, ProFormTextArea} from '@ant-design/pro-components';
import defaultData from "@/utils/defaultData.json";
import {Button, message} from "antd";
import _ from "lodash";
import {addProject} from "@/services/project";
import {addGroupProject} from "@/services/group-project";
import {CopyOutlined} from "@ant-design/icons";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";

export type CopyProjectProps = {
  projectJSON: any;
};

const CopyProject: React.FC<CopyProjectProps> = (props) => {
  const {profile, dataTypeDomains} = useProjectStore(state => ({
    profile: state.project?.projectJSON?.profile,
    dataTypeDomains: state.project?.projectJSON?.dataTypeDomains,
  }), shallow);
  const emptyProject = {
    "projectName": "",
    "description": "",
    "tags": "",
    "projectJSON": {
      ...defaultData
    },
    "configJSON": {synchronous: {upgradeType: "increment"}},
  }


  return (<>
    <ModalForm
      title="复刻为新项目(从当前版本创建新项目)"
      trigger={
        <Button key="copy" size={"small"} type={"link"} icon={<CopyOutlined/>}>复刻</Button>
      }
      onFinish={async (values: any) => {

        console.log(39, values);
        console.log(39, props.projectJSON);
        if (values.type.value === 1) {
          addProject({
            ...emptyProject,
            projectJSON: {
              profile,
              dataTypeDomains,
              modules: props.projectJSON?.modules || emptyProject.projectJSON.modules
            },
            projectName: values.projectName,
            description: values.description,
            tags: _.join(values.tags, ',')
          }).then((r) => {
            console.log(54, r);
            if (r.code === 200) {
              message.success(
                <>
                  复刻成功，
                  <a href="/project/recent">立即打开</a>
                </>, 5
              );
            }
          });
        } else {
          addGroupProject({
            ...emptyProject,
            projectJSON: {
              profile,
              dataTypeDomains,
              modules: props.projectJSON?.modules || emptyProject.projectJSON.modules
            },
            projectName: values.projectName,
            description: values.description,
            tags: _.join(values.tags, ',')
          }).then((r) => {
            console.log(54, r);
            if (r.code === 200) {
              message.success(
                <>
                  复刻成功，
                  <a href="/project/recent">立即打开</a>
                </>, 5
              );
            }
          });
        }
      }}
    >
      <ProFormText
        width="md"
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
      <ProFormSelect
        name="type"
        width="md"
        label="项目类型"
        fieldProps={{
          labelInValue: true,
        }}
        options={[
          {label: '个人项目', value: 1},
          {label: '团队项目', value: 2},
        ]}
      />
      <ProFormSelect
        width="md"
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
    </ModalForm>
  </>);
}

export default React.memo(CopyProject)
