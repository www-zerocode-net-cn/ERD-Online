import React from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import moment from 'moment';
import useProjectStore from "@/store/project/useProjectStore";
import * as Save from '@/utils/save';
import {Button, message} from "antd";

export type InitVersionProps = {};

const InitVersion: React.FC<InitVersionProps> = (props) => {
  const {hasDB, init, versionDispatch} = useVersionStore(state => ({
    hasDB: state.hasDB,
    init: state.init,
    versionDispatch: state.dispatch

  }), shallow);

  console.log(21, hasDB, init);
  const {projectJSON} = useProjectStore(state => ({
    projectJSON: state.project?.projectJSON,

  }), shallow);
  return (<>
    <ModalForm
      title="初始化基线"
      trigger={
        <Button
          type={"primary"}
          key="selection"
          disabled={!hasDB || !init}
          >初始化基线</Button>
      }
      onFinish={async (values: any) => {
        console.log(32, 'setUpgradeType', values);
        // 基线文件只需要存储modules信息
        const currentDBData = versionDispatch.getCurrentDBData();
        if (!currentDBData) {
          message.warn("未配置数据库源，请先配置数据源！");
          return false;
        }
        const version = {
          projectJSON: {
            modules: projectJSON.modules || [],
          },
          dbKey: currentDBData.key || '',
          baseVersion: true,
          version: values.version,
          versionDesc: values.versionDesc,
          changes: [],
          versionDate: moment().format('YYYY/M/D H:m:s'),
        };
        Save.hisProjectSave(version).then((res) => {
          if (res.code === 200) {
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
        placeholder="例如：1.0.0「请勿低于系统默认的数据源版本0.0.0」"
        formItemProps={{
          rules: [
            {
              required: true,
              message: '不能为空',
            },
            {
              pattern: new RegExp(/^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/),
              message: '版本号格式不对,版本需满足正则：/^([1-9]\\d|[1-9])(\\.([1-9]\\d|\\d)){2}$/，正确示例：1.0.1',
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
