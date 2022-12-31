import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {CopyOutlined} from "@ant-design/icons";

export type CopyModuleProps = {
  disable: boolean;
  moduleInfo: any;
};

const CopyModule: React.FC<CopyModuleProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<CopyOutlined />}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.copyModule(props.moduleInfo)}
            disabled={props.disable}
    >复制模块</Button>
  </>);
}

export default React.memo(CopyModule)
