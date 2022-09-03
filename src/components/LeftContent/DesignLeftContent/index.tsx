import React from 'react';

import "./index.less";
import DataTable from "@/components/LeftContent/DesignLeftContent/component/DataTable";
import DataDomain from "@/components/LeftContent/DesignLeftContent/component/DataDomain";
import {Tabs} from "antd";

const {TabPane} = Tabs;


export type DesignLeftContentProps = {
  collapsed: boolean|undefined;
};

const DesignLeftContent: React.FC<DesignLeftContentProps> = (props) => {


    return (
      props.collapsed ? <></> : <Tabs defaultActiveKey="1" centered={true}>
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
    )
  }
;

export default React.memo(DesignLeftContent)
