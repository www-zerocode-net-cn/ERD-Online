import React from 'react';
import {Popconfirm} from "antd";
import {MenuItem} from "@blueprintjs/core";
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import DeleteIcon from "@mui/icons-material/Delete";


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
    <Popconfirm placement="right" title={`删除版本[${currentVersion.version}]`}
                onConfirm={() => versionDispatch.updateVersionData(currentVersion, currentVersion, 'delete')} okText="是"
                cancelText="否">
      <MenuItem key="delete" shouldDismissPopover={false} text="删除版本" icon={<DeleteIcon/>}></MenuItem>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveVersion)
