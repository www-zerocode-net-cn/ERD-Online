import React from 'react';
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {compareStringVersion} from "@/utils/string";
import {Button} from "antd";
import {CloudServerOutlined, CloudUploadOutlined} from "@ant-design/icons";


export type SyncVersionProps = {
  synced: boolean;
};

const SyncVersion: React.FC<SyncVersionProps> = (props) => {
  const {
    currentVersionIndex,
    currentVersion,
    versions,
    dbVersion,
    versionDispatch
  } = useVersionStore(state => ({
    currentVersionIndex: state.currentVersionIndex,
    currentVersion: state.currentVersion,
    synchronous: state.synchronous,
    versions: state.versions,
    dbVersion: state.dbVersion,
    versionDispatch: state.dispatch,
  }), shallow);

  return (<>
    <Button key="sync" icon={props.synced ? <CloudServerOutlined/> : <CloudUploadOutlined/>}
            type={"link"}
            size={"small"}
            disabled={props.synced}
            onClick={() => {
              versionDispatch.readDb(
                props.synced,
                currentVersion,
                currentVersionIndex ? versions[currentVersionIndex + 1] || currentVersion : currentVersion, currentVersion.changes,
                currentVersionIndex === (versions.length - 1), true);
            }}>同步</Button>

  </>);
}

export default React.memo(SyncVersion)
