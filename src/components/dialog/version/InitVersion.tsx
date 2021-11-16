import React from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import moment from 'moment';
import useProjectStore from "@/store/project/useProjectStore";
import * as Save from '@/utils/save';
import {message} from "antd";

export type InitVersionProps = {};

const InitVersion: React.FC<InitVersionProps> = (props) => {
  const {init,versionDispatch} = useVersionStore(state => ({
    init: state.init,
    versionDispatch: state.dispatch

  }), shallow);
  const {projectJSON} = useProjectStore(state => ({
    projectJSON: state.project?.projectJSON,

  }), shallow);
  return (<>
    <ModalForm
      title="初始化基线"
      trigger={
        <Button
          key="selection"
          icon="selection"
          text="初始化基线"
          minimal={true}
          small={true}
          fill={true}
          disabled={!init}
          alignText={Alignment.LEFT}></Button>
      }
      onFinish={async (values: any) => {
        console.log(32, 'setUpgradeType', values);
        // 基线文件只需要存储modules信息
        const version = {
          projectJSON: {
            modules: projectJSON.modules || [],
          },
          baseVersion: true,
          version: values.version,
          versionDesc: values.versionDesc,
          changes: [],
          versionDate: moment().format('YYYY/M/D H:m:s'),
        };
        Save.hisProjectSave(version).then((res) => {
          if (res) {
            message.success('初始化基线成功');
            versionDispatch.getVersionMessage(res.data, true);
            versionDispatch.setState({
              changes: [],
              init: false,
              versions: res.data,
            });
            // 更新版本表
            versionDispatch.dropVersionTable();
          } else {
            message.error('操作失败！');
          }
        }).catch((err) => {
          message.error(`操作失败:${err.message}`);
        });
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="version"
        label="版本号"
        placeholder="例如：v1.0.0【请勿低于系统默认的数据库版本v0.0.0】"
        formItemProps={{
          rules: [
            {
              required: true,
              message: '不能为空',
            },
            {
              max: 100,
              message: '不能大于 200 个字符',
            },
          ],
        }}
      />
      <ProFormTextArea
        width="md"
        name="versionDesc"
        label="版本描述"
        placeholder="'例如：初始化当前项目版本"
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

export default React.memo(InitVersion)
