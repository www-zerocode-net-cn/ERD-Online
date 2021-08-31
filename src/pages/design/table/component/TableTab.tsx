import React from 'react';
import {Icon, Tab, Tabs} from "@blueprintjs/core";
import TableObjectList from "@/pages/design/table/component/TableObjectList";
import TableInfoEdit from "@/pages/design/table/component/TableInfoEdit";


export type TableTabProps = {};

const TableTab: React.FC<TableTabProps> = (props) => {
  return (
    <>
      <Tabs
        id="navbar"
        animate={false}
        renderActiveTabPanelOnly={true}
      >
        <Tab id="object" title="对象" panel={<TableObjectList/>}></Tab>
        <Tab id="table" title="数据表" panel={<TableInfoEdit/>}><Icon icon="small-cross"/></Tab>
        <Tab id="domain" title="数据域" panel={<TableObjectList/>}><Icon icon="small-cross"/></Tab>
        <Tab id="domain1" title="数据域"><Icon icon="small-cross"/></Tab>
        <Tab id="domain2" title="数据域"><Icon icon="small-cross"/></Tab>
        <Tab id="domain3" title="数据域"><Icon icon="small-cross"/></Tab>
        <Tab id="domain4" title="数据域"><Icon icon="small-cross"/></Tab>
        <Tab id="domain5" title="数据域"><Icon icon="small-cross"/></Tab>
      </Tabs>
    </>
  );
}

export default React.memo(TableTab)
