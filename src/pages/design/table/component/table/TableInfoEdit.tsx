import React, {useRef} from 'react';
import {HotTable} from "@handsontable/react";
import 'handsontable/dist/handsontable.full.css';
import "handsontable/languages/zh-CN";
import useProjectStore from "@/store/project/useProjectStore";
import {ModuleEntity} from "@/store/tab/useTabStore";
import shallow from "zustand/shallow";
// @ts-ignore
import {CellChange, ChangeSource} from "handsontable";
import {
  column1,
  column2,
  handsontableAfterChange,
  handsontableAfterRowMove,
  handsontableBeforeChange
} from "@/components/dialog/setup/DefaultField";
import JExcel from "@/pages/JExcel";


export type TableInfoEditProps = {
  moduleEntity: ModuleEntity
};


const TableInfoEdit: React.FC<TableInfoEditProps> = (props) => {

  const {datatype, database, entity, projectDispatch} = useProjectStore(state => ({
    entity: state.project?.projectJSON?.modules[state.currentModuleIndex || 0]?.entities[state.currentEntityIndex || 0],
    datatype: state.project?.projectJSON?.dataTypeDomains?.datatype,
    database: state.project?.projectJSON?.dataTypeDomains?.database,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('datatype', 115, datatype)

  const allDataTypeName = datatype.map((t: any) => {
    return t.name;
  })

  // 由于 zustand 冻结了所有属性，均不可直接编辑，所以需要做一次转换
  const s = JSON.stringify(entity?.fields || [{}]);

  const afterChange = (payload: any) => {
    projectDispatch.updateEntityFields(payload);
  }

  const hotTableComponent = useRef(null);


  const hotSettings = {
    data: JSON.parse(s),
    columns: [
      ...column1,
      {
        data: 'typeName',
        type: 'dropdown',
        source: allDataTypeName,
        allowInvalid: false,
        allowEmpty: false
      },
      ...column2
    ],
    allowInvalid: false,
    allowRemoveColumn: false,
    stretchH: "all",
    height: 700,
    fixedRowsTop: 0,
    columnSorting: true,
    autoWrapRow: true,
    manualRowResize: true,
    manualColumnResize: true,
    rowHeaders: true,
    colHeaders: [
      '字段名*',
      '逻辑名(英文名)*',
      '类型*',
      '类型(code)',
      '数据源类型',
      '说明',
      '主键',
      '非空',
      '自增',
      '默认值',
      '关系图',
      'UI建议',
    ],
    manualRowMove: true,
    manualColumnMove: true,
    filters: true,
    dropdownMenu: true,
    mergeCells: false,
    copyPaste: true,
    language: "zh-CN",
    licenseKey: 'non-commercial-and-evaluation',
    className: "htCenter htMiddle",
    currentRowClassName: 'currentRow',
    currentColClassName: 'currentCol',
    customBorders: false,
    contextMenu: true,
    allowInsertColumn: false,
    minRows: 1
  };


  const data = JSON.parse(s);
  const columns = [{
    title: '中文名*',
    name: 'chnname',
    type: 'text',
    width: '100',
  }, {
    title: '英文名*',
    name: 'name',
    type: 'text',
    width: '100'
  }, {
    title: '类型*',
    name: 'typeName',
    type: 'dropdown',
    source: allDataTypeName,
    width: '100',

  }, {
    title: '类型(code)',
    name: 'type',
    type: 'text',
    width: '100',
    readOnly: true
  }, {
    title: '数据源类型',
    name: 'dataType',
    type: 'text',
    width: '130',
    readOnly: true
  }, {
    title: '说明',
    name: 'remark',
    type: 'text',
    width: '100',
  }, {
    title: '主键',
    name: 'pk',
    type: 'checkbox',
    width: '50',
  }, {
    title: '非空',
    name: 'notNull',
    type: 'checkbox',
    width: '50',
  }, {
    title: '自增',
    name: 'autoIncrement',
    type: 'checkbox',
    width: '50',
  }, {
    title: '关系图',
    name: 'relationNoShow',
    type: 'checkbox',
    width: '50',
  }, {
    title: '默认值',
    name: 'defaultValue',
    type: 'text',
    width: '100',
  }, {
    title: 'UI建议',
    name: 'uiHint',
    type: 'dropdown',
    width: '100',
    source: ['Text', 'Number', 'Money', 'Select', 'Radio', 'CheckBox', 'Email', 'URL', 'DatePicker', 'TextArea', 'AddressPicker'],
  }
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
      <JExcel data={data} columns={columns} saveData={afterChange} notEmptyColumn={['chnname','name','typeName']}/>
    </>
  );
}

export default React.memo(TableInfoEdit)
