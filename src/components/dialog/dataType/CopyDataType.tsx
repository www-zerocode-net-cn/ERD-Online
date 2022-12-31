import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {CopyOutlined} from "@ant-design/icons";

export type CopyDataTypeProps = {
  disable: boolean;
};

const CopyDataType: React.FC<CopyDataTypeProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<CopyOutlined/>}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.copyDatatype()}
            disabled={props.disable}
    >复制元数据</Button>
  </>);
}

export default React.memo(CopyDataType)
