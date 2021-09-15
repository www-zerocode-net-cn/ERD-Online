import React from 'react';
import {Divider, Tab, Tabs} from "@blueprintjs/core";


export type DbTabProps = {};

const DbTab: React.FC<DbTabProps> = (props) => {
  return (
    <>
      <Divider/>
      <Tabs
        id="dbNav"
        animate={false}
        renderActiveTabPanelOnly={true}
        className="tabs-table-height"
      >
        <Tab id="CREATE_TABLE" title="新建表"></Tab>
        <Tab id="DELETE_TABLE" title="删除表"> </Tab>
        <Tab id="RECREATE_TABLE" title="重建表"></Tab>
        <Tab id="ADD_FIELD" title="新增字段"></Tab>
        <Tab id="DELETE_FIELD" title="删除字段"></Tab>
        <Tab id="UPDATE_FIELD" title="修改字段"></Tab>
        <Tab id="CREATE_INDEX" title="新建索引"></Tab>
        <Tab id="DELETE_INDEX" title="删除索引"></Tab>
      </Tabs>
    </>
  );
}

export default React.memo(DbTab)
