import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Popconfirm} from "antd";

export type RemoveModuleProps = {
  disable: boolean;
};

const RemoveModule: React.FC<RemoveModuleProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Popconfirm placement="right" title="删除模块"
                onConfirm={() => projectDispatch.removeModule()} okText="是"
                cancelText="否">
      <Button icon="remove"
              text={"删除模块"}
              minimal={true}
              small={true}
              disabled={props.disable}
              fill={true}
              alignText={Alignment.LEFT}
      ></Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveModule)
