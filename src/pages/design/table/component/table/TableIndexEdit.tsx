import React, {useRef} from 'react';
import {HotTable} from "@handsontable/react";
import 'handsontable/dist/handsontable.full.css';
import "handsontable/languages/zh-CN";
import useProjectStore from "@/store/project/useProjectStore";
import {ModuleEntity} from "@/store/tab/useTabStore";
// @ts-ignore
import {CellChange, ChangeSource, Core, GridSettings} from "handsontable";
import _ from "lodash";
import {message, Select, Tag} from "antd";
import ReactDOM from 'react-dom';

export type TableIndexEditProps = {
  moduleEntity: ModuleEntity
};


const TableIndexEdit: React.FC<TableIndexEditProps> = (props) => {

  // @ts-ignore
  const {entity, projectDispatch} = useProjectStore(state => ({
    entity: state.project?.projectJSON?.modules[state.currentModuleIndex || 0].entities[state.currentEntityIndex || 0],
    projectDispatch: state.dispatch,
  }));

  console.log(32, 'entity', entity);

  const fields = entity?.fields.map((f: any, index: number) => {
    return {value: f.name};
  });

  // 由于 zustand 冻结了所有属性，均不可直接编辑，所以需要做一次转换
  const s = JSON.stringify(entity?.indexs || [{}]);

  const afterChange = (payload: any) => {
    projectDispatch.updateEntityIndex(payload);
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


  const tagRender = (props: any) => {
    const {label, closable, onClose} = props;
    const onPreventMouseDown = (event: any) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{marginRight: 3}}
      >
        {label}
      </Tag>
    );
  }

  const hotSettings = {
    data: JSON.parse(s),
    columns: [
      {
        data: 'name',
        validator: emptyValidator
      },
      {
        data: 'fields',
        validator: emptyValidator,
        readOnly: true,
        allowEmpty: false,
        renderer: (instance: Core, td: HTMLElement, row: number, col: number, prop: string | number, value: any, cellProperties: GridSettings) => {
          // 渲染之前先移除原有的组件
          while (td.firstChild) {
            td.removeChild(td.firstChild);
          }
          const indexId = `index-${row}-${col}`;
          console.log(71, 'value', value);
          console.log(72, 'cellProperties', cellProperties);
          const newDIV = document.createElement('div');
          newDIV.id = indexId;

          const new_component = <Select
            key={`${row}-${col}`}
            mode="multiple"
            showArrow
            tagRender={tagRender}
            defaultValue={value}
            style={{width: '100%'}}
            options={fields}
            onChange={(value: any, option: any) => {
              console.log(130, value)
              console.log(131, option)
              // @ts-ignore
              const {hotInstance} = hotTableComponent.current;
              console.log(90, 'hotInstance', hotInstance);
              console.log(111, '_.concat(value)', _.compact(value));
              hotInstance.setDataAtRowProp(row, 'fields', _.compact(value) || []);
            }}
          />;
          console.log(93, 'new_component', new_component);
          console.log(94, 'newDIV', newDIV);
          setTimeout(() => {
            ReactDOM.render(new_component, newDIV);
          }, 100);
          td.appendChild(newDIV);

          console.log(101, 'td', td);
          return td;
        }
      },
      {
        data: 'isUnique',
        type: 'checkbox'
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
      '索引名*',
      '字段*',
      '是否唯一',
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
      /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
      afterRemoveRow={(index: number, amount: number) => {
        const payload = hotSettings.data;
        console.log(186, payload);
        afterChange(payload);
      }}
    >

    </HotTable>
  );
}

export default React.memo(TableIndexEdit)
