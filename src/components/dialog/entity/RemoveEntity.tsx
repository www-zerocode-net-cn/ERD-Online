import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button, Popconfirm} from "antd";
import {MinusOutlined} from "@ant-design/icons";

export type RemoveEntityProps = {
  disable: boolean;
};

const RemoveEntity: React.FC<RemoveEntityProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Popconfirm placement="right" title="删除表"
                onConfirm={() => projectDispatch.removeEntity()} okText="是"
                cancelText="否">
      <Button icon={<MinusOutlined />}
              type="text"
              size={"small"}
              disabled={props.disable}
      >删除表</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveEntity)
