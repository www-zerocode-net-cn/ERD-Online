import React from 'react';
import {HotTable} from "@handsontable/react";
import 'handsontable/dist/handsontable.full.css';
import '../DarkTheme.less'
import "handsontable/languages/zh-CN";
import useProjectStore from "@/store/project/useProjectStore";
import {ModuleEntity} from "@/store/tab/useTabStore";

export type TableInfoEditProps = {
  moduleEntity: ModuleEntity
};


const TableInfoEdit: React.FC<TableInfoEditProps> = (props) => {
  const modules = useProjectStore(state => state.project.projectJSON.modules);
  console.log('modules', modules);

  const module = modules?.find((m: any) => m.name === props.moduleEntity?.module);
  console.log('module', module);

  const entity = module?.entities.find((e: any) => e.title === props.moduleEntity?.entity);
  console.log('entity', entity)

  const hotSettings = {
    data: entity?.fields || [],
    columns: [
      {
        data: 'chnname',
        type: 'text',
      },
      {
        data: 'name',
        type: 'text'
      },
      {
        data: 'type',
        type: 'autocomplete', strict: true, filter: true,
        visibleRows: 10,
        trimDropdown: true,
        allowInvalid: false,
        allowEmpty: false,
        source: ['整数', '大整数1', '大整数2', '大整数3', '大整数4', '大整数5', '金额1', '金额2', '金额3', '金额4'],
      },
      {
        data: 'dataType',
        type: 'autocomplete', strict: true, filter: true,
        visibleRows: 10,
        trimDropdown: true,
        allowInvalid: false,
        allowEmpty: false,
        source: ['整数', '大整数1', '大整数2', '大整数3', '大整数4', '大整数5', '金额1', '金额2', '金额3', '金额4'],
      },
      {
        data: 'remark',
        type: 'text'
      },
      {
        data: 'pk',
        type: 'checkbox',
      },
      {
        data: 'notNull',
        type: 'checkbox',
      },
      {
        data: 'autoIncrement',
        type: 'checkbox',
      },
      {
        data: 'defaultValue',
        type: 'checkbox',
      },
      {
        data: 'relationNoShow',
        type: 'checkbox',
      },
      {
        data: 'uiHint',
        type: 'autocomplete', strict: true, filter: true,
        visibleRows: 10,
        trimDropdown: true,
        allowInvalid: false,
        allowEmpty: false,
        source: ['整数', '大整数1', '大整数2', '大整数3', '大整数4', '大整数5', '金额1', '金额2', '金额3', '金额4'],
      },
    ],
    allowRemoveColumn: false,
    stretchH: "all",
    width: "100%",
    height: "80%",
    colWidths: 100,
    fixedRowsTop: 0,
    columnSorting: true,
    autoWrapRow: true,
    manualRowResize: true,
    manualColumnResize: true,
    rowHeaders: true,
    colHeaders: [
      '字段名',
      '逻辑名(英文名)',
      '类型',
      '数据库类型',
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
    customBorders: false,
    contextMenu: true,
    allowInsertColumn: false,
    editor: 'text',
  };
  return (
    <HotTable
      id={"data-sheet"}
      // @ts-ignore
      settings={hotSettings}
    >

    </HotTable>
  );
}

export default React.memo(TableInfoEdit);
