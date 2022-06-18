import React from 'react';

import {Tab, Tabs} from "@blueprintjs/core";
import {Fill, LeftResizable, Top} from "react-spaces";
import './index.less'
import DataTable from "@/components/LeftContent/DesignLeftContent/component/DataTable";
import DataDomain from "@/components/LeftContent/DesignLeftContent/component/DataDomain";


export type DesignLeftContentProps = {};

const DesignLeftContent: React.FC<DesignLeftContentProps> = (props) => {


    return (
      <LeftResizable size="15%">
        <Fill>
          <Top size="100%" scrollable={true}>

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
          </Top>
        </Fill>
      </LeftResizable>
    )
  }
;

export default React.memo(DesignLeftContent)
