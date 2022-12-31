import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {SnippetsOutlined} from "@ant-design/icons";

export type PastEntityProps = {
  disable: boolean;
};

const PastEntity: React.FC<PastEntityProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<SnippetsOutlined />}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.pastEntity()}
            disabled={props.disable}
    >粘贴表</Button>
  </>);
}

export default React.memo(PastEntity)
