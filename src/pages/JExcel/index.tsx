// @ts-nocheck
import React, {useEffect, useRef, useState} from "react";
import jspreadsheet, {CellValue} from "jspreadsheet-ce";

import _ from 'lodash';
import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jspreadsheet-ce/dist/jspreadsheet.datatables.css";
import "jsuites/dist/jsuites.css"

import "./index.less"
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {List, message, Modal, Tag} from "antd";
import {ExclamationCircleOutlined} from "@ant-design/icons";

export type JExcelProps = {
  data: any,
  columns: any,
  saveData: any,
  notEmptyColumn: string[],
};

const JExcel: React.FC<JExcelProps> = (props) => {
  const {syncing, setSyncing, datatype, database} = useProjectStore(state => ({
    syncing: state.syncing,
    setSyncing: state.dispatch.setSyncing,
    datatype: state.project?.projectJSON?.dataTypeDomains?.datatype,
    database: state.project?.projectJSON?.dataTypeDomains?.database,
  }), shallow);


  console.log('datatype', 115, datatype)
  const {data, columns, saveData, notEmptyColumn} = props;
  const saveValidData = (excelData: any) => {
    console.log(30, 'excel数据有变动', excelData);
    //正在同步远程数据
    if (syncing) {
      return;
    }
    if (!excelData || excelData.length === 0) {
      return;
    }
    if (notEmptyColumn) {
      excelData = _.reject(excelData, function (o) {
        const findIndex = _.findIndex(notEmptyColumn, function (f) {
          return !o[f] || o[f] == '';
        });
        return findIndex > -1;
      });
    }
    console.log(30, excelData);
    saveData(excelData);
  }


  const jRef = useRef(null);

  const introduces = [
    {
      title: '复制',
      description: 'Windows：Ctrl + C              |             Mac：command + C',
    },
    {
      title: '粘贴',
      description: 'Windows：Ctrl + V              |             Mac：command + V',
    },
    {
      title: '剪切',
      description: 'Windows：Ctrl + X              |             Mac：command + X',
    },
    {
      title: '撤销',
      description: 'Windows：Ctrl + Z              |            Mac：command + Z',
    },
    {
      title: '重做',
      description: 'Windows：Ctrl + Shit + Z              |            Mac：command + Shit + Z',
    },

  ];

  const options = {
    data,
    columns,
    allowExport: false,
    minDimensions: [1, 1],
    csvHeaders: true,
    columnResize: true,
    search: true,
    toolbar: [
      {
        type: 'i',
        content: 'undo',
        tooltip: '撤销',
        onclick: function () {
          jRef?.current?.jexcel.undo();
        }
      },
      {
        type: 'i',
        content: 'redo',
        tooltip: '重做',
        onclick: function () {
          // @ts-ignore
          jRef?.current?.jexcel.redo();
        }
      },
      {
        type: 'i',
        content: 'add',
        tooltip: '末尾增加一行',
        onclick: function () {
          // @ts-ignore
          jRef?.current?.jexcel.insertRow();
        }
      },
      {
        type: 'i',
        content: 'remove',
        tooltip: '删除选中行',
        onclick: function () {
          // @ts-ignore
          jRef?.current?.jexcel.deleteRow()
        }
      },
      {
        type: 'i',
        content: 'publish',
        tooltip: '在此前插入行',
        onclick: function () {
          const selectedRows = jRef?.current?.jexcel.getSelectedRows();
          console.log('publish', selectedRows)

          if (!selectedRows || !selectedRows[0]?.dataset) {
            message.warning('未选中行');
            return;
          }
          jRef?.current?.jexcel.insertRow(1, parseInt(selectedRows[0].dataset.y), 1);

        }
      },
      {
        type: 'i',
        content: 'get_app',
        tooltip: '在此后插入行',
        onclick: function () {
          const selectedRows = jRef?.current?.jexcel.getSelectedRows();
          console.log('get_app', selectedRows)

          if (!selectedRows || !selectedRows[selectedRows.length - 1]?.dataset) {
            message.warning('未选中行');
            return;
          }
          // @ts-ignore
          jRef?.current?.jexcel.insertRow(1, parseInt(selectedRows[selectedRows.length - 1].dataset.y));
        }
      },

      {
        type: 'i',
        content: 'help_outline',
        tooltip: '快捷操作',
        onclick: function () {
          Modal.info({
            title: "快捷操作",
            width: 500,
            content: <>
              <List
                itemLayout="horizontal"
                dataSource={introduces}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<a>{item.title}</a>}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
              <Tag icon={<ExclamationCircleOutlined />} color="warning">
                小彩蛋： 您还不知道吧！<br/>
                这个列表可以像excel一样操作；<br/>
                还能从excel里面粘贴数据！<br/>
              </Tag>
            </>
          });
        }
      },
    ],
    text: {
      "noRecordsFound": "未找到",
      "showingPage": "显示 {1} 条中的第 {0} 条",
      "show": "显示 ",
      "search": "搜索",
      "entries": " 条目",
      "columnName": "列标题",
      "insertANewColumnBefore": "在此前插入列",
      "insertANewColumnAfter": "在此后插入列",
      "deleteSelectedColumns": "删除选定列",
      "renameThisColumn": "重命名列",
      "orderAscending": "升序",
      "orderDescending": "降序",
      "insertANewRowBefore": "在此前插入行",
      "insertANewRowAfter": "在此后插入行",
      "deleteSelectedRows": "删除选定行",
      "editComments": "编辑批注",
      "addComments": "插入批注",
      "comments": "批注",
      "clearComments": "删除批注",
      "copy": "复制...",
      "paste": "粘贴...",
      "saveAs": "保存为...",
      "about": "关于",
      "areYouSureToDeleteTheSelectedRows": "确定删除选定行?",
      "areYouSureToDeleteTheSelectedColumns": "确定删除选定列?",
      "thisActionWillDestroyAnyExistingMergedCellsAreYouSure": "这一操作会破坏所有现存的合并单元格，确认操作？",
      "thisActionWillClearYourSearchResultsAreYouSure": "这一操作会清空搜索结果，确认操作？",
      "thereIsAConflictWithAnotherMergedCell": "与其他合并单元格有冲突",
      "invalidMergeProperties": "无效的合并属性",
      "cellAlreadyMerged": "单元格已合并",
      "noCellsSelected": "未选定单元格"
    },
    about: false,
    onchange: (instance: HTMLElement,
               cell: HTMLTableCellElement,
               /** (e.g.) "0", "1" ... */
               columnIndex: string,
               /** (e.g.) "0", "1" ... */
               rowIndex: string,
               value: CellValue,) => {
      console.log('onchange', jRef?.current?.jexcel.getJson())
      console.log(161, columnIndex, rowIndex, value);
      const rowData = jRef?.current?.jexcel.getRowData(rowIndex);
      console.log(169, datatype, rowData);
      const d = _.find(datatype, {'name': value});
      const defaultDatabaseCode = _.find(database, {"defaultDatabase": true}).code || database[0].code;
      const code = _.get(d, 'code');
      const path = `apply.${defaultDatabaseCode}.type`;
      const type = _.get(d, path);
      //只有类型一列变化时，才更新后两列
      if (d && defaultDatabaseCode && code && type && Number(columnIndex) == 2) {
        jRef?.current?.jexcel?.setValueFromCoords(Number(columnIndex) + 1, rowIndex, code, true);
        jRef?.current?.jexcel?.setValueFromCoords(Number(columnIndex) + 2, rowIndex, type, true);
      }
      saveValidData(jRef?.current?.jexcel.getJson());

    },
    oninsertrow: () => {
      console.log('oninsertrow', jRef?.current?.jexcel.getJson())
      // saveValidData(jRef?.current?.jexcel.getJson())
    },
    ondeleterow: () => {
      console.log('ondeleterow', jRef?.current?.jexcel.getJson())
      saveValidData(jRef?.current?.jexcel.getJson())
    },
    onmoverow: () => {
      console.log('onmoverow', jRef?.current?.jexcel.getJson())
      saveValidData(jRef?.current?.jexcel.getJson())
    },
    onpaste: () => {
      console.log('onpaste', jRef?.current?.jexcel.getJson())
      saveValidData(jRef?.current?.jexcel.getJson())
    },
    onundo: () => {
      console.log('onundo', jRef?.current?.jexcel.getJson())
      saveValidData(jRef?.current?.jexcel.getJson())
    },
    onredo: () => {
      console.log('onredo', jRef?.current?.jexcel.getJson())
      saveValidData(jRef?.current?.jexcel.getJson())
    },
  };

  useEffect(() => {
    if (!jRef.current.jspreadsheet) {
      jspreadsheet(jRef.current, options);
    }
  }, [options]);

  useEffect(() => {
    if (syncing) {

    }
  }, [props.data]);


  const addRow = () => {
    jRef?.current?.jexcel.insertRow();
  };

  return (

    <div ref={jRef}/>
  );
}

export default JExcel
