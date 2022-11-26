import React from 'react';

import "./index.less";
import {Input} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import useGlobalStore from "@/store/global/globalStore";
import shallow from "zustand/shallow";
import QueryTree from "@/components/LeftContent/QueryLeftContent/component/QueryTree";


export type QueryLeftContentProps = {
  collapsed: boolean | undefined;
};

const QueryLeftContent: React.FC<QueryLeftContentProps> = (props) => {
    const {globalDispatch} = useGlobalStore(state => ({
      globalDispatch: state.dispatch
    }), shallow);

    return (
      props.collapsed ? <></> :
        <>
          <Input
            style={{
              borderRadius: 4,
              marginInlineEnd: 12,
            }}
            allowClear
            size={"small"}
            prefix={<SearchOutlined/>}
            placeholder="搜索历史SQL"
            onPressEnter={(e) => {
              // @ts-ignore
              globalDispatch.setSearchKey(e.target?.value)
            }}
          />
          <QueryTree/>
        </>
    )
  }
;

export default React.memo(QueryLeftContent)
