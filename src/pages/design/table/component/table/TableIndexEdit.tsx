import React from 'react';
import 'handsontable/dist/handsontable.full.css';
import "handsontable/languages/zh-CN";
import useProjectStore from "@/store/project/useProjectStore";
import {ModuleEntity} from "@/store/tab/useTabStore";
// @ts-ignore
import {CellChange, ChangeSource, Core, GridSettings} from "handsontable";
import _ from "lodash";
import JExcel from "@/pages/JExcel";

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
    return f.name;
  });

  console.log(33, 'fields', fields);


  // 由于 zustand 冻结了所有属性，均不可直接编辑，所以需要做一次转换
  const s = JSON.stringify(entity?.indexs || [{}]);

  const afterChange = (payload: any) => {
    console.log(40, 'afterChange', payload);
    payload = payload.map((m: any) => {
      return {
        ...m,
        fields: m.fields.constructor === String ? _.split(_.trimStart(m?.fields, ";"), ";") : m.fields
      }
    });
    console.log(46, 'afterChange', payload);
    projectDispatch.updateEntityIndex(payload);
  }

  const data = JSON.parse(s);
  const columns = [{
    title: '索引名*',
    name: 'name',
    type: 'text',
    width: document.body.clientWidth * 0.2,
  }, {
    title: '字段*',
    name: 'fields',
    type: 'dropdown',
    width: document.body.clientWidth * 0.35,
    multiple: true,
    source: fields
  }, {
    title: '是否唯一',
    name: 'isUnique',
    type: 'checkbox',
    width: document.body.clientWidth * 0.1,
  }];
  return (
    /*    <HotTable
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
          /!* eslint-disable-next-line @typescript-eslint/no-unused-vars *!/
          afterRemoveRow={(index: number, amount: number) => {
            const payload = hotSettings.data;
            console.log(186, payload);
            afterChange(payload);
          }}
        >

        </HotTable>*/
    <JExcel data={data} columns={columns} saveData={afterChange} notEmptyColumn={['name', 'fields']}/>

  );
}

export default React.memo(TableIndexEdit)
