import React from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";


export type RebuildVersionProps = {};

const RebuildVersion: React.FC<RebuildVersionProps> = (props) => {
  const {init, versionDispatch} = useVersionStore(state => ({
    init: state.init,
    versionDispatch: state.dispatch,
  }), shallow);
  return (<>
    <ModalForm
      title={<span>重建基线<span style={{color: "red"}}>（重建基线将会清除当前项目的所有版本信息，该操作不可逆）</span></span>}
      onFinish={async (values: any) => {
        console.log(29, values);
        const tempValue = {
          version: values.version,
          versionDesc: values.versionDesc,
        };
        versionDispatch.rebuild(tempValue);
        return true;
      }}
      trigger={
        <Button
          key="undo"
          icon="undo"
          text="重建基线"
          minimal={true}
          small={true}
          fill={true}
          disabled={init}
          alignText={Alignment.LEFT}
        ></Button>
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

export default React.memo(RebuildVersion)
