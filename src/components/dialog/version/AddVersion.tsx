import React, {useEffect} from 'react';
import {ModalForm, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";


export type AddVersionProps = {};

const AddVersion: React.FC<AddVersionProps> = (props) => {
  const {init} = useVersionStore(state => ({
    init: state.init,
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
      trigger={
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
