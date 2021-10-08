import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Popconfirm} from "antd";

export type RemoveDataTypeProps = {
  disable: boolean;
};

const RemoveDataType: React.FC<RemoveDataTypeProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Popconfirm placement="right" title="删除字段类型"
                onConfirm={() => projectDispatch.removeDatatype()} okText="是"
                cancelText="否">
      <Button icon="remove"
              text={"删除字段类型"}
              minimal={true}
              small={true}
              disabled={props.disable}
              fill={true}
              alignText={Alignment.LEFT}
      ></Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveDataType)
