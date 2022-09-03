import React from 'react';
import DbTab from "@/pages/design/table/component/tab/DbTab";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {ModuleEntity} from "@/store/tab/useTabStore";
import {Tabs} from "antd";

const {TabPane} = Tabs;

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
      <Tabs
        id="codeNav"
      >
        {database?.map((db: any) => {
          return <TabPane key={db.code} id={db.code} tab={db.code}><DbTab dbCode={db.code}
                                                                          moduleEntity={props.moduleEntity}/></TabPane>
        })}
      </Tabs>
    </>
  );
}

export default React.memo(CodeTab)
