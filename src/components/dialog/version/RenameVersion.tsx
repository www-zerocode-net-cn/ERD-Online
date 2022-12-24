import React from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-components";
import {MenuItem} from "@blueprintjs/core";
import EditIcon from "@mui/icons-material/Edit";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {compareStringVersion} from "@/utils/string";
import {Button, message} from "antd";
import {EditOutlined} from "@ant-design/icons";


export type RenameVersionProps = {};

const RenameVersion: React.FC<RenameVersionProps> = (props) => {
  const {currentVersionIndex, currentVersion, versions, versionDispatch} = useVersionStore(state => ({
    currentVersionIndex: state.currentVersionIndex,
    currentVersion: state.currentVersion,
    versions: state.versions,
    versionDispatch: state.dispatch,
  }), shallow);

  console.log(17, 'currentVersion', currentVersion)
  console.log(22, 'currentVersionIndex', currentVersionIndex)

  return (<>
    <ModalForm
      title="编辑版本"
      onFinish={async (values: any) => {
        console.log(39, values);
        const tempValue = {
          ...currentVersion,
          version: values.version,
          versionDesc: values.versionDesc,
        };

        const tempVersions = versions.slice(1);
        if (currentVersionIndex !== 0) {
          versionDispatch.updateVersionData(tempValue, currentVersion, 'update');
        } else if (tempVersions.map((v: any) => v.version).includes(tempValue.version)) {
          message.error('该版本号已经存在了');
        } else if (tempVersions[0] &&
          compareStringVersion(tempValue.version, tempVersions[0].version) <= 0) {
          message.error('新版本不能小于或等于已经存在的版本');
        } else {
          versionDispatch.updateVersionData(tempValue, currentVersion, 'update');
        }
        return true;
      }}
      trigger={
        <Button key="editor" size={"small"} type={"link"} icon={<EditOutlined />}>编辑版本</Button>
      }
      request={async (params) => {
        return currentVersion;
      }}
    >
      <ProFormText
        width="md"
        name="version"
        label="版本号"
        placeholder="请输入版本号"
        readonly={currentVersionIndex !== 0}
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
              message: '不能大于 100 个字符',
            },
          ],
        }}
      />
      <ProFormTextArea
        width="md"
        name="versionDesc"
        label="版本描述"
        placeholder="请输入版本描述"
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

export default React.memo(RenameVersion)
