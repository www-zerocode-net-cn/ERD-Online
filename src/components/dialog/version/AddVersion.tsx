import React, {useEffect} from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {Button as AntButton} from "antd";
import {InfoCircleOutlined}  from '@ant-design/icons';

export type AddVersionProps = {
  trigger: string;
};

const AddVersion: React.FC<AddVersionProps> = (props) => {
  const {init, versionDispatch} = useVersionStore(state => ({
    init: state.init,
    versionDispatch: state.dispatch,
  }), shallow);


  useEffect(() => {
    console.log("kaishi");
    return () => {
      console.log("jieshu");

    };
  });

  return (<>
    <ModalForm
      title="新增版本"
      onFinish={async (values: any) => {
        console.log(29, values);
        const tempValue = {
          version: values.version,
          versionDesc: values.versionDesc,
        };
        versionDispatch.saveNewVersion(tempValue);
        return true;
      }}
      trigger={
        props.trigger === "bp" ?
          <Button
            key="artifact"
            icon="add-to-artifact"
            text="新增版本"
            minimal={true}
            small={true}
            fill={true}
            alignText={Alignment.LEFT}
            disabled={init}
          ></Button>
          : <AntButton
            type="primary"
            disabled={init}
            title={init ? "未配置数据源不能新增版本" : ""}
            icon={init ? <InfoCircleOutlined /> : ""}

          >新增版本</AntButton>

      }
    >
      <ProFormText
        width="md"
        name="version"
        label="版本号"
        placeholder="请输入版本号"
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
};

export default React.memo(AddVersion)
