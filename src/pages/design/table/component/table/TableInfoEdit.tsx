import React, {useEffect} from 'react';
import 'handsontable/dist/handsontable.full.css';
import "handsontable/languages/zh-CN";
import useProjectStore from "@/store/project/useProjectStore";
import {ModuleEntity} from "@/store/tab/useTabStore";
import shallow from "zustand/shallow";
// @ts-ignore
import {CellChange, ChangeSource} from "handsontable";
import JExcel from "@/pages/JExcel";
import {column1, column2} from "@/pages/design/setting/component/DefaultField";
import {FloatButton} from "antd";
import {TableOutlined} from "@ant-design/icons";
import StandardFieldLibrary from "@/pages/design/table/component/table/StandardFieldLibrary";


export type TableInfoEditProps = {
  moduleEntity: ModuleEntity
};


const TableInfoEdit: React.FC<TableInfoEditProps> = (props) => {

  const {datatype, entity, projectDispatch} = useProjectStore(state => ({
    entity: state.project?.projectJSON?.modules[state.currentModuleIndex || 0]?.entities[state.currentEntityIndex || 0],
    datatype: state.project?.projectJSON?.dataTypeDomains?.datatype,
    database: state.project?.projectJSON?.dataTypeDomains?.database,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('datatype', 115, datatype)

  const allDataTypeName = datatype?.map((t: any) => {
    return t.name;
  })


  console.log('entity:useEffect', 148, entity)



  // 由于 zustand 冻结了所有属性，均不可直接编辑，所以需要做一次转换
  const s = JSON.stringify(entity?.fields || [{}]);

  const afterChange = (payload: any) => {
    projectDispatch.updateEntityFields(payload);
  }

  const data = JSON.parse(s);
  const columns = [
    ...column1, {
      title: '类型*',
      name: 'typeName',
      type: 'dropdown',
      source: allDataTypeName,
      width: '150',
    },
    ...column2
  ];
  return (
    <>
      {/*      <HotTable
        ref={hotTableComponent}
        id={"data-sheet"}
        settings={hotSettings}
        beforeChange={handsontableBeforeChange(hotTableComponent, datatype, database)}
        afterChange={handsontableAfterChange(hotSettings, afterChange)}
        afterRowMove={handsontableAfterRowMove(hotTableComponent, hotSettings, afterChange)}
      >
      </HotTable>*/}
      <JExcel data={data} columns={columns} saveData={afterChange} notEmptyColumn={['name', 'typeName']}/>
    </>
  );
}

export default React.memo(TableInfoEdit)
