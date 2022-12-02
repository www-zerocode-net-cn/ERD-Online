import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button, Popconfirm} from "antd";
import {MinusOutlined} from "@ant-design/icons";
import useQueryStore from "@/store/query/useQueryStore";

export type RemoveQueryProps = {
  model: any;
};

const RemoveQuery: React.FC<RemoveQueryProps> = (props) => {
  const {queryDispatch} = useQueryStore(state => ({
    queryDispatch: state.dispatch,
  }), shallow);


  return (<>
    <Popconfirm placement="right" title={props.model.isLeaf ? "删除查询" : "删除目录"}
                onConfirm={() => queryDispatch.removeQuery(props?.model)} okText="是"
                cancelText="否">
      <Button icon={<MinusOutlined/>}
              type="text"
              size={"small"}
      >{props.model.isLeaf ? "删除查询" : "删除目录"}</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveQuery)
