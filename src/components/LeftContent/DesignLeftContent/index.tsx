import React from 'react';

import {Tab, Tabs} from "@blueprintjs/core";
import {Left} from "react-spaces";
import './index.less'
import DataTable from "@/components/LeftContent/DesignLeftContent/component/DataTable";
import DataDomain from "@/components/LeftContent/DesignLeftContent/component/DataDomain";


export type DesignLeftContentProps = {};

const DesignLeftContent: React.FC<DesignLeftContentProps> = (props) => {


    return (
      <Left size="10%">
        <Tabs
          id="navbar"
          animate={false}
          large={true}
          renderActiveTabPanelOnly={true}
          className="left-table-tab"
        >
          <Tab id="table" title="数据表" panel={<DataTable/>}></Tab>
          <Tab id="domain" title="数据域" panel={<DataDomain/>}/>
        </Tabs>

      </Left>
    )
  }
;

export default React.memo(DesignLeftContent)
