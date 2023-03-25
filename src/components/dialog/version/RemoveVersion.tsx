import React from 'react';
import {Button, Popconfirm} from "antd";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {DeleteOutlined} from "@ant-design/icons";


export type RemoveVersionProps = {};

const RemoveVersion: React.FC<RemoveVersionProps> = (props) => {
  const {currentVersion, versionDispatch} = useVersionStore(state => ({
    currentVersionIndex: state.currentVersionIndex,
    currentVersion: state.currentVersion,
    versions: state.versions,
    versionDispatch: state.dispatch,
  }), shallow);

  console.log(17, 'currentVersion', currentVersion)
  return (<>
    <Popconfirm placement="right" title={`删除版本「${currentVersion.version}」`}
                onConfirm={() => versionDispatch.updateVersionData(currentVersion, currentVersion, 'delete')} okText="是"
                cancelText="否">
      <Button key="delete" size={"small"} type={"link"} icon={<DeleteOutlined/>}>删除</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveVersion)
