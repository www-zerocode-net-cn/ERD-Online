import React, {useState} from 'react';
import {Button, ButtonGroup, Divider, NonIdealState, OverflowList} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core/src/common/index";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import useTabStore from "@/store/tab/useTabStore";
import AddEntity from "@/pages/design/table/component/dialog/entity/AddEntity";
import {Popconfirm} from "antd";
import {ContextMenu2} from '@blueprintjs/popover2';
import {renderEntityRightContext} from "@/components/LeftContent/DesignLeftContent";


export type TableObjectListProps = {};
const TableObjectList: React.FC<TableObjectListProps> = (props) => {
  const {modules, currentModuleName, projectDispatch} = useProjectStore(state => ({
    modules: state.project?.projectJSON?.modules,
    currentModuleName: state.currentModule,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('13', modules)
  const tabDispatch = useTabStore(state => state.dispatch);
  const currentModule = modules?.find((m: any) => m.name === currentModuleName);
  /* const currentModuleIndex = modules?.findIndex((m: any) => m.name === currentModuleName); */


  const [disabled, setDisabled] = useState(true);
  const [selectTable, setSelectTable] = useState('');

  console.log('currentModuleName21', currentModuleName);
  const moduleDisable = currentModuleName === undefined || currentModuleName.replaceAll(' ', '') === '';
  console.log('moduleDisable', 23, moduleDisable);


  const visibleItemRenderer = ({title, chnname, ...restProps}: any) => {
    // customize rendering of last breadcrumb
    return <ContextMenu2
      content={renderEntityRightContext({title, chnname})}
      onContextMenu={() => projectDispatch.setCurrentEntity(title)}
    >
      <Button small={true}
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
                projectDispatch.setCurrentEntity(title);
              }}
              icon="th"/></ContextMenu2>

  };


  return (
    <>
      <Divider/>
      <ButtonGroup minimal={true} className="table-button-tool-group">
        {/* <Button icon="database" text={"打开表"} small={true} disabled={disabled}></Button> */}
        <Button icon="edit" text={"设计表"} small={true} disabled={disabled}
                onClick={() => tabDispatch.addTab({module: currentModuleName, entity: selectTable})}></Button>
        <AddEntity moduleDisable={moduleDisable}/>
        <Popconfirm placement="right" title="删除表"
                    onConfirm={() => projectDispatch.removeEntity()} okText="是"
                    cancelText="否">
          <Button icon="remove"
                  text={"删除表"}
                  minimal={true}
                  disabled={disabled}
                  small={true}
                  fill={true}
                  alignText={Alignment.LEFT}
          ></Button>
        </Popconfirm>
        {/*        <Button icon="import" text={"导入向导"} small={true} disabled={moduleDisable}></Button>
        <Button icon="export" text={"导出向导"} small={true} disabled={moduleDisable}></Button> */}
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
          description={`${currentModuleName||''} 这里空空如也`}
          className="no-table"
        />
      }

    </>
  )
};

export default React.memo(TableObjectList);
