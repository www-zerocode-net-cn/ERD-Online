import React from 'react';
import {Button, Popconfirm} from "antd";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {CopyOutlined, RollbackOutlined} from "@ant-design/icons";


export type CopyVersionProps = {};

const CopyVersion: React.FC<CopyVersionProps> = (props) => {
  const {currentVersion, versionDispatch} = useVersionStore(state => ({
    currentVersionIndex: state.currentVersionIndex,
    currentVersion: state.currentVersion,
    versions: state.versions,
    versionDispatch: state.dispatch,
  }), shallow);

  console.log(17, 'currentVersion', currentVersion)
  return (<>
    <Popconfirm placement="right" title={`基于版本『${currentVersion.version}』创建新项目`}
                onConfirm={() => versionDispatch.updateVersionData(currentVersion, currentVersion, 'delete')} okText="是"
                cancelText="否">
      <Button key="copy" size={"small"} type={"link"} icon={<CopyOutlined/>}>复刻</Button>
    </Popconfirm>
  </>);
}

export default React.memo(CopyVersion)
