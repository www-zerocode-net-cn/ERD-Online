import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {CopyOutlined} from "@ant-design/icons";

export type CopyEntityProps = {
  disable: boolean;
  entityInfo: any;
};

const CopyEntity: React.FC<CopyEntityProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<CopyOutlined/>}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.copyEntity(props.entityInfo)}
            disabled={props.disable}
    >复制表</Button>
  </>);
}

export default React.memo(CopyEntity)
