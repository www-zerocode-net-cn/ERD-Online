import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button, Popconfirm} from "antd";
import {MinusOutlined} from "@ant-design/icons";

export type RemoveModuleProps = {
  disable: boolean;
};

const RemoveModule: React.FC<RemoveModuleProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Popconfirm placement="right" title="删除模块"
                onConfirm={() => projectDispatch.removeModule()} okText="是"
                cancelText="否">
      <Button icon={<MinusOutlined />}
              type="text"
              size={"small"}
              disabled={props.disable}
      >删除模块</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveModule)
