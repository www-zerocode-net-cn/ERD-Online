import React from 'react';

import "./index.less";
import DataTable from "@/components/LeftContent/DesignLeftContent/component/DataTable";
import DataDomain from "@/components/LeftContent/DesignLeftContent/component/DataDomain";
import {Input, Tabs} from "antd";
import {SearchOutlined} from "@ant-design/icons";
import useGlobalStore from "@/store/global/globalStore";
import shallow from "zustand/shallow";

const {TabPane} = Tabs;


export type DesignLeftContentProps = {
  collapsed: boolean | undefined;
};

const DesignLeftContent: React.FC<DesignLeftContentProps> = (props) => {
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
            placeholder="搜索表"
            onPressEnter={(e) => {
              // @ts-ignore
              globalDispatch.setSearchKey(e.target?.value)
            }}
          />
          <Tabs defaultActiveKey="1" centered={true}>
            <TabPane
              tab={
                <div>
                  数据表
                </div>
              }
              key="1"
            >
              <DataTable/>
            </TabPane>
            <TabPane
              tab={
                <div>
                  数据域
                </div>
              }
              key="2"
            >
              <DataDomain/>
            </TabPane>
          </Tabs>
        </>
    )
  }
;

export default React.memo(DesignLeftContent)
