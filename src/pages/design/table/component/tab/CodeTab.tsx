import React from 'react';
import {Divider, Tab, Tabs} from "@blueprintjs/core";
import DbTab from "@/pages/design/table/component/tab/DbTab";


export type CodeTabProps = {};

const CodeTab: React.FC<CodeTabProps> = (props) => {
  return (
    <>
      <Divider/>
      <Tabs
        id="codeNav"
        animate={false}
        renderActiveTabPanelOnly={true}
        className="tabs-table-height"
      >
        <Tab id="MYSQL" title="MYSQL" panel={<DbTab/>}></Tab>
        <Tab id="ORACLE" title="ORACLE" panel={<DbTab/>}> </Tab>
        <Tab id="SQLSERVER" title="SQLSERVER" panel={<DbTab/>}></Tab>
        <Tab id="POSTGRESQL" title="POSTGRESQL" panel={<DbTab/>}></Tab>
        <Tab id="JAVA" title="JAVA" panel={<DbTab/>}></Tab>
      </Tabs>
    </>
  );
}

export default React.memo(CodeTab)
