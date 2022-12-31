import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {ScissorOutlined} from "@ant-design/icons";

export type CutEntityProps = {
  disable: boolean;
  entityInfo: any;
};

const CutEntity: React.FC<CutEntityProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<ScissorOutlined />}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.cutEntity(props.entityInfo)}
            disabled={props.disable}
    >剪切表</Button>
  </>);
}

export default React.memo(CutEntity)
