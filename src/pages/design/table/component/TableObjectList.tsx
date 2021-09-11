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
  const module = useTabStore(state => state.currentModule);
  const currentModule = modules?.find((m: any) => m.name === module);


  const [disabled, setDisabled] = useState(true);


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
                   onClick={() => setDisabled(false)}
                   icon="th"/>

  };
  return (
    <>
      <Divider/>
      <ButtonGroup minimal={true} className="table-button-tool-group">
        <Button icon="database" text={"打开表"} small={true} disabled={disabled}></Button>
        <Button icon="edit" text={"设计表"} small={true} disabled={disabled}></Button>
        <Button icon="insert" text={"新建表"} small={true}></Button>
        <Button icon="trash" text={"删除表"} small={true} disabled={disabled}></Button>
        <Button icon="import" text={"导入向导"} small={true}></Button>
        <Button icon="export" text={"导出向导"} small={true}></Button>
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
          description={`${module} 模块没有任何表`}
          className="no-table"
        />
      }

    </>
  )
};

export default React.memo(TableObjectList);
