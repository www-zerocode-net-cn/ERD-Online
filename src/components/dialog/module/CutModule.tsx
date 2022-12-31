import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button} from "antd";
import {ScissorOutlined} from "@ant-design/icons";

export type CutModuleProps = {
  disable: boolean;
  moduleInfo: any;
};

const CutModule: React.FC<CutModuleProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Button icon={<ScissorOutlined />}
            type="text"
            size={"small"}
            onClick={() => projectDispatch.cutModule(props.moduleInfo)}
            disabled={props.disable}
    >剪切模块</Button>
  </>);
}

export default React.memo(CutModule)
