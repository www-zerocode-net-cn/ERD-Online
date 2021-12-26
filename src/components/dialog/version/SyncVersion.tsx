import React from 'react';
import {MenuItem} from "@blueprintjs/core";
import SyncIcon from "@mui/icons-material/Sync";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import {compareStringVersion} from "@/utils/string";


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
    <MenuItem key="sync" shouldDismissPopover={false} text="同步到数据源" icon={<SyncIcon/>}
              disabled={compareStringVersion(currentVersion.version, dbVersion) <= 0 ? true : !!synchronous[currentVersion.version]}
              onClick={() => {
                versionDispatch.readDb(
                  compareStringVersion(currentVersion.version, dbVersion) <= 0,
                  currentVersion,
                  currentVersionIndex ? versions[currentVersionIndex + 1] || currentVersion : currentVersion, currentVersion.changes,
                  currentVersionIndex === (versions.length - 1), true)
              }}/>

  </>);
}

export default React.memo(SyncVersion)
