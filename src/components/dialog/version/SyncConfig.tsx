import React from 'react';
import {ModalForm, ProForm, ProFormRadio} from "@ant-design/pro-components";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {ControlOutlined} from "@ant-design/icons";


export type SyncConfigProps = {};

const SyncConfig: React.FC<SyncConfigProps> = (props) => {
  const {upgradeType, projectDispatch} = useProjectStore(state => ({
    upgradeType: state.project?.configJSON?.synchronous?.upgradeType,
    projectDispatch: state.dispatch,

  }), shallow);
  console.log(14, 'upgradeType', upgradeType);

  return (<>
    <ModalForm
      title={<span>同步配置<span style={{color: "red"}}>（配置成功后，后续的同步的操作都使用该配置，仅建议项目初始化之后设置一次，以后不要变动，免得出现版本混乱）</span></span>}
      trigger={
        <Button
          key="refresh"
          type={"primary"}><ControlOutlined/>同步配置</Button>
      }
      onFinish={async (values: any) => {
        console.log(32, 'setUpgradeType', values);
        await projectDispatch.setUpgradeType(values);
        return true;
      }}

    >
      <ProForm.Group>
        <ProFormRadio.Group
          name="upgradeType"
          label="数据表升级方式"
          initialValue={upgradeType}
          options={[
            {
              label: '字段增量',
              value: 'increment',
            },
            {
              label: '重建数据表',
              value: 'rebuild',
            },
          ]}
        />
      </ProForm.Group>

    </ModalForm>
  </>);
}

export default React.memo(SyncConfig)
