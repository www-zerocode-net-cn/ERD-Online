import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {SnippetsOutlined} from "@ant-design/icons";

export type PastDataTypeProps = {
  disable: boolean;
};

const PastDataType: React.FC<PastDataTypeProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<SnippetsOutlined />}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.pastDatatype()}
            disabled={props.disable}
    >粘贴元数据</Button>
  </>);
}

export default React.memo(PastDataType)
