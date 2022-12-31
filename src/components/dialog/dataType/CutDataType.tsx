import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {ScissorOutlined} from "@ant-design/icons";

export type CutDataTypeProps = {
  disable: boolean;
};

const CutDataType: React.FC<CutDataTypeProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<ScissorOutlined/>}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.cutDatatype()}
            disabled={props.disable}
    >剪切元数据</Button>
  </>);
}

export default React.memo(CutDataType)
