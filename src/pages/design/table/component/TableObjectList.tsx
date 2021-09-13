import React, {useState} from 'react';
import {Button, ButtonGroup, Divider, NonIdealState, OverflowList} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core/src/common/index";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import useTabStore from "@/store/tab/useTabStore";


export type TableObjectListProps = {};
const TableObjectList: React.FC<TableObjectListProps> = (props) => {
  const {modules} = useProjectStore(state => ({modules: state.project?.projectJSON?.modules}), shallow);
  console.log('13', modules)
  const currentModuleName = useTabStore(state => state.currentModule);
  const tabDispatch = useTabStore(state => state.dispatch);
  const currentModule = modules?.find((m: any) => m.name === currentModuleName);
 /* const currentModuleIndex = modules?.findIndex((m: any) => m.name === currentModuleName); */


  const [disabled, setDisabled] = useState(true);
  const [selectTable, setSelectTable] = useState('');

  console.log('currentModuleName21', currentModuleName);
  const moduleEditable = currentModuleName === undefined || currentModuleName.replaceAll(' ', '') === '';
  console.log('moduleEditable',23, moduleEditable);

  const visibleItemRenderer = ({title, ...restProps}: any) => {
    // customize rendering of last breadcrumb
    return <Button small={true}
                   key={title}
                   alignText={Alignment.LEFT}
                   text={title}
                   title={title}
                   minimal={true}
                   active={false}
                   fill={false}
                   style={{textOverflow: "ellipsis"}}
                   onClick={() => {
                     setDisabled(false);
                     setSelectTable(title);
                   }}
                   icon="th"/>

  };
  return (
    <>
      <Divider/>
      <ButtonGroup minimal={true} className="table-button-tool-group">
        {/* <Button icon="database" text={"打开表"} small={true} disabled={disabled}></Button> */}
        <Button icon="edit" text={"设计表"} small={true} disabled={disabled}
                onClick={() => tabDispatch.addTab({module: currentModuleName, entity: selectTable})}></Button>
        <Button icon="insert" text={"新建表"} small={true} disabled={moduleEditable}></Button>
        <Button icon="trash" text={"删除表"} small={true} disabled={disabled}></Button>
        <Button icon="import" text={"导入向导"} small={true} disabled={moduleEditable}></Button>
        <Button icon="export" text={"导出向导"} small={true} disabled={moduleEditable}></Button>
      </ButtonGroup>
      <Divider/>
      {currentModule && currentModule.entities && currentModule.entities.length > 0 ?
        <OverflowList
          tagName="div"
          className="tableNameList"
          items={currentModule.entities}
          visibleItemRenderer={visibleItemRenderer}
        /> :
        <NonIdealState
          icon={"info-sign"}
          title={"提示："}
          description={`${currentModuleName} 模块没有任何表`}
          className="no-table"
        />
      }

    </>
  )
};

export default React.memo(TableObjectList);
