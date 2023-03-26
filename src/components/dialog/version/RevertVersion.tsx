import React from 'react';
import {Button, Popconfirm} from "antd";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {RollbackOutlined} from "@ant-design/icons";


export type RevertVersionProps = {
  synced: boolean;
};

const RevertVersion: React.FC<RevertVersionProps> = (props) => {
  const {currentVersion, versionDispatch} = useVersionStore(state => ({
    currentVersionIndex: state.currentVersionIndex,
    currentVersion: state.currentVersion,
    versions: state.versions,
    versionDispatch: state.dispatch,
  }), shallow);

  console.log(17, 'currentVersion', currentVersion)
  return (<>
    <Popconfirm placement="right" title={`回滚至版本『${currentVersion.version}』(数据源中元数据不变)`}
                onConfirm={() => versionDispatch.revertVersionData()} okText="是"
                cancelText="否">
      <Button key="revert"
              size={"small"}
              type={"link"}
              icon={<RollbackOutlined/>}>回滚</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RevertVersion)
