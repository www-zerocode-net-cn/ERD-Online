import React from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";


export type InitVersionProps = {};

const InitVersion: React.FC<InitVersionProps> = (props) => {
  const {init} = useVersionStore(state => ({
    init: state.init,
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
