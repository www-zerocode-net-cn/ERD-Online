import React, {useRef} from 'react';
import {HotTable} from "@handsontable/react";
import 'handsontable/dist/handsontable.full.css';
import '../DarkTheme.less'
import "handsontable/languages/zh-CN";
import useProjectStore from "@/store/project/useProjectStore";
import {ModuleEntity} from "@/store/tab/useTabStore";
import shallow from "zustand/shallow";
// @ts-ignore
import {CellChange, ChangeSource} from "handsontable";
import _ from "lodash";
import {message} from "antd";


export type TableInfoEditProps = {
  moduleEntity: ModuleEntity
};


const TableInfoEdit: React.FC<TableInfoEditProps> = (props) => {

  const {datatype, database, modules, projectDispatch} = useProjectStore(state => ({
    modules: state.project?.projectJSON?.modules,
    datatype: state.project?.projectJSON?.dataTypeDomains?.datatype,
    database: state.project?.projectJSON?.dataTypeDomains?.database,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('datatype', 115, datatype)
  console.log('modules', 23, modules);

  const module = modules?.find((m: any) => m.name === props.moduleEntity?.module);
  console.log('module', module);

  const entity = module?.entities.find((e: any) => e.title === props.moduleEntity?.entity);
  console.log('entity', entity);

  const allDataTypeName = datatype.map((t: any) => {
    return t.name;
  })

  // 由于 zustand 冻结了所有属性，均不可直接编辑，所以需要做一次转换
  const s = JSON.stringify(entity?.fields || [{}]);

  const afterChange = (payload: any) => {
    projectDispatch.updateEntityFields(payload);
  }

  const hotTableComponent = useRef(null);


  // Empty validator
  const emptyValidator = (value: any, callback: any) => {
    if (!value || value.length === 0) {
      console.log('false');
      message.error("当前编辑项不允许为空");
      callback(false);
    } else {
      console.log('true');
      callback(true);
    }
  };

  const hotSettings = {
    data: JSON.parse(s),
    columns: [
      {
        data: 'chnname',
        validator: emptyValidator
      },
      {
        data: 'name',
        validator: emptyValidator
      },
      {
        data: 'typeName',
        type: 'dropdown',
        source: allDataTypeName,
        allowInvalid: false,
        allowEmpty: false
      },
      {
        data: 'type',
        type: 'text',
        readOnly: true
      },
      {
        data: 'dataType',
        type: 'text',
        readOnly: true
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
        type: 'text',
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
        source: ['Text', 'Number', 'Money', 'Select', 'Radio', 'CheckBox', 'Email', 'URL', 'DatePicker', 'TextArea', 'AddressPicker'],
      },
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
    currentRowClassName: 'currentRow',
    currentColClassName: 'currentCol',
    customBorders: false,
    contextMenu: true,
    allowInsertColumn: false,
    minRows: 1
  };
  return (
    <HotTable
      ref={hotTableComponent}
      id={"data-sheet"}
      // @ts-ignore
      settings={hotSettings}
      beforeChange={(changes: CellChange[], source: ChangeSource) => {
        if (changes) {
          changes.forEach((c: CellChange) => {
            const [row, prop, oldValue, newValue] = c;
            // @ts-ignore
            const {hotInstance} = hotTableComponent.current;
            console.log(163, hotInstance.getDataAtRow(row));
            if (prop === 'typeName' && oldValue !== newValue) {
              const d = _.find(datatype, {'name': newValue});
              const defaultDatabaseCode = _.find(database, {"defaultDatabase": true}).code || database[0].code;
              const path = `apply.${defaultDatabaseCode}.type`;
              hotInstance.setDataAtRowProp(row, 'type', _.get(d, 'code'));
              hotInstance.setDataAtRowProp(row, 'dataType', _.get(d, path));
            }
          });
        }
      }}
      afterChange={(changes: CellChange[] | null, source: ChangeSource) => {
        console.log(189, changes);
        console.log(190, source);
        // // @ts-ignore
        // const {hotInstance} = hotTableComponent.current;
        // hotInstance.selectRows(2)
        if (changes) {
          const payload = hotSettings.data;
          console.log(193, payload);
          afterChange(payload);
        }
      }}
      afterRowMove={(startRow: number, endRow: number) => {
        console.log(198, startRow[0], endRow);
        // @ts-ignore
        const {hotInstance} = hotTableComponent.current;
        const payload = hotSettings.data;
        console.log(203, payload);
        console.log(209, hotInstance);
        const finalData: any[] = [];
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        const {_arrayMap} = hotInstance.getPlugin('manualRowMove').rowsMapper;
        // eslint-disable-next-line no-plusplus
        for (let loop = 0; loop < hotSettings.data.length; loop++) {
          const data = hotSettings.data[_arrayMap[loop]];
          finalData.push(data);
        }
        // 延迟一会保存数据，避免页面渲染混乱
        setTimeout(() => {
          // eslint-disable-next-line no-underscore-dangle
          hotInstance.getPlugin('manualRowMove').rowsMapper._arrayMap = _.sortBy(_arrayMap);
          // eslint-disable-next-line no-underscore-dangle
          console.log(218, 'rowPositions', hotInstance.getPlugin('manualRowMove').rowsMapper._arrayMap);
          console.log(239, 'finalData', finalData);
          afterChange(finalData);
        }, 200);

      }
      }
    >

    </HotTable>
  );
}

export default React.memo(TableInfoEdit)
