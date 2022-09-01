import React, {useState} from 'react';
import {Button, ButtonGroup, Divider, NonIdealState, OverflowList} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core/src/common/index";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import AddEntity from "@/components/dialog/entity/AddEntity";
import {Popconfirm} from "antd";
import {ContextMenu2} from '@blueprintjs/popover2';
import {renderEntityRightContext} from "@/components/LeftContent/DesignLeftContent/component/DataTable";


export type TableObjectListProps = {};
const TableObjectList: React.FC<TableObjectListProps> = (props) => {
  const {currentModule, currentModuleName, projectDispatch} = useProjectStore(state => ({
    currentModule: state.project?.projectJSON?.modules[state.currentModuleIndex || 0],
    currentModuleName: state.currentModule,
    projectDispatch: state.dispatch,
  }), shallow);
  /* const currentModuleIndex = modules?.findIndex((m: any) => m.name === currentModuleName); */


  const [disabled, setDisabled] = useState(true);
  //@ts-ignore
  const [selectTable, setSelectTable] = useState('');

  console.log('currentModuleName21', currentModuleName);
  const moduleDisable = currentModuleName === undefined || currentModuleName.replaceAll(' ', '') === '';
  console.log('moduleDisable', 23, moduleDisable);


  const visibleItemRenderer = ({title, chnname, ...restProps}: any) => {
    // customize rendering of last breadcrumb
    return <ContextMenu2
      content={renderEntityRightContext({title, chnname})}
      onContextMenu={() => projectDispatch.setCurrentEntity(title)}
      key={title}
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
      <ButtonGroup minimal={true}>
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
          description={`${currentModuleName || ''} 这里空空如也`}
          className="no-table"
        />
      }

    </>
  )
};

export default React.memo(TableObjectList);
