import React from 'react';
import ProForm, {ModalForm, ProFormRadio} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";


export type SyncConfigProps = {};

const SyncConfig: React.FC<SyncConfigProps> = (props) => {
  return (<>
    <ModalForm
      title="同步配置（配置成功后，后续的同步的操作都使用该配置）"
      trigger={
        <Button
          key="refresh"
          icon="refresh"
          text="同步配置"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }

    >
      <ProForm.Group>
        <ProFormRadio.Group
          name="upgradeType"
          label="数据表升级方式"
          options={[
            {
              label: '重建数据表',
              value: 'rebuild',
            },
            {
              label: '字段增量',
              value: 'increment',
            }
          ]}
        />
      </ProForm.Group>

    </ModalForm>
  </>);
}

export default React.memo(SyncConfig)
