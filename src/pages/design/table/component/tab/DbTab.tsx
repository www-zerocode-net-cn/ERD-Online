import React from 'react';
import {Divider, Tab, Tabs} from "@blueprintjs/core";
import TableCodeShow from "@/pages/design/table/component/table/TableCodeShow";
import {ModuleEntity} from "@/store/tab/useTabStore";


export type DbTabProps = {
  dbCode: string;
  moduleEntity: ModuleEntity
};

const DbTab: React.FC<DbTabProps> = (props) => {
  const {dbCode, moduleEntity} = props;
  return (
    <>
      <Divider/>
      <Tabs
        id="dbNav"
        animate={false}
        renderActiveTabPanelOnly={true}
        className="tabs-table-height"
      >
        <Tab id="createTableTemplate" title="新建表"
             panel={<TableCodeShow dbCode={dbCode} templateCode="createTableTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="deleteTableTemplate" title="删除表"
             panel={<TableCodeShow dbCode={dbCode} templateCode="deleteTableTemplate"
                                   moduleEntity={moduleEntity}/>}> </Tab>
        <Tab id="rebuildTableTemplate" title="重建表"
             panel={<TableCodeShow dbCode={dbCode} templateCode="rebuildTableTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="createFieldTemplate" title="新增字段"
             panel={<TableCodeShow dbCode={dbCode} templateCode="createFieldTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="updateFieldTemplate" title="删除字段"
             panel={<TableCodeShow dbCode={dbCode} templateCode="updateFieldTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="deleteFieldTemplate" title="修改字段"
             panel={<TableCodeShow dbCode={dbCode} templateCode="deleteFieldTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="createIndexTemplate" title="新建索引"
             panel={<TableCodeShow dbCode={dbCode} templateCode="createIndexTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="deleteIndexTemplate" title="删除索引"
             panel={<TableCodeShow dbCode={dbCode} templateCode="deleteIndexTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="createPkTemplate" title="新建主键"
             panel={<TableCodeShow dbCode={dbCode} templateCode="createPkTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
        <Tab id="deletePkTemplate" title="删除主键"
             panel={<TableCodeShow dbCode={dbCode} templateCode="deletePkTemplate"
                                   moduleEntity={moduleEntity}/>}></Tab>
      </Tabs>
    </>
  );
}

export default React.memo(DbTab)
