import React from 'react';
import {Divider, Tab, Tabs} from "@blueprintjs/core";
import DbTab from "@/pages/design/table/component/tab/DbTab";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {ModuleEntity} from "@/store/tab/useTabStore";


export type CodeTabProps = {
  moduleEntity: ModuleEntity
};

const CodeTab: React.FC<CodeTabProps> = (props) => {
  const {database} = useProjectStore(state => ({
    database: state.project?.projectJSON?.dataTypeDomains?.database,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('database', 15, database)

  return (
    <>
      <Divider/>
      <Tabs
        id="codeNav"
        animate={false}
        renderActiveTabPanelOnly={true}
        className="tabs-table-height"
      >
        {database?.map((db: any) => {
          return <Tab key={db.code} id={db.code} title={db.code} panel={<DbTab dbCode={db.code} moduleEntity={props.moduleEntity}/>}></Tab>
        })}
      </Tabs>
    </>
  );
}

export default React.memo(CodeTab)
