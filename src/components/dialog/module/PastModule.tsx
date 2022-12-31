import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {SnippetsOutlined} from "@ant-design/icons";

export type PastModuleProps = {
  disable: boolean;
};

const PastModule: React.FC<PastModuleProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<SnippetsOutlined />}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.pastModule()}
            disabled={props.disable}
    >粘贴模块</Button>
  </>);
}

export default React.memo(PastModule)
