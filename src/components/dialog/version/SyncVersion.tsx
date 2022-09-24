import React from 'react';
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {compareStringVersion} from "@/utils/string";
import {Button} from "antd";
import {CloudServerOutlined, CloudSyncOutlined, CloudUploadOutlined} from "@ant-design/icons";


export type SyncVersionProps = {};

const SyncVersion: React.FC<SyncVersionProps> = (props) => {
  const {
    currentVersionIndex,
    currentVersion,
    synchronous,
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
    <Button key="sync" icon={compareStringVersion(currentVersion.version, dbVersion) <= 0 ? <CloudServerOutlined /> : <CloudUploadOutlined />}
            type={"link"}
            size={"small"}
            disabled={compareStringVersion(currentVersion.version, dbVersion) <= 0 ? true : !!synchronous[currentVersion.version]}
            onClick={() => {
              versionDispatch.readDb(
                compareStringVersion(currentVersion.version, dbVersion) <= 0,
                currentVersion,
                currentVersionIndex ? versions[currentVersionIndex + 1] || currentVersion : currentVersion, currentVersion.changes,
                currentVersionIndex === (versions.length - 1), true)
            }}>同步到数据源</Button>

  </>);
}

export default React.memo(SyncVersion)
