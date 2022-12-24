// @ts-nocheck
import React, { useRef, useEffect } from "react";
import jspreadsheet from "jspreadsheet-ce";

import "jspreadsheet-ce/dist/jspreadsheet.css";
import "jspreadsheet-ce/dist/jspreadsheet.datatables.css";
import "jsuites/dist/jsuites.css"

import "./index.less"

const JExcel: React.FC = () => {
  const jRef = useRef(null);
  const options = {
    data:[
      {
        name:'Paulo',
        id:'3',
        age:'40',
        gender:'Male'
    },
    {
        name:'Cosme Sergio',
        id:'4',
        age:'48',
        gender:'Male'
    },
    {
        name:'Jorgina Santos',
        id:'5',
        age:'32',
        gender:'Female'
    },
  ],
  columns: [
      {
          type:'text',
          width:'40',
          name:'id',
          title:'Id',
          allowEmpty:false
      },
      {
          type:'text',
          width:'200',
          name:'name',
          title:'Name',
      },
      {
          type:'text',
          width:'100',
          name:'age',
          title:'Age',
      },
      {
          type:'hidden',
          name:'gender'
      },
   ],
   allowExport:false,
   minDimensions:[1,1],
   csvHeaders:true,
    columnResize:false,
    search:true,
    toolbar:[
      {
          type: 'i',
          content: 'undo',
          tooltip:'撤销',
          onclick: function() {
            jRef?.current?.jexcel.undo();
          }
      },
      {
          type: 'i',
          content: 'redo',
          tooltip:'重做',
          onclick: function() {
            jRef?.current?.jexcel.redo();
          }
      },
      {
          type: 'i',
          content: 'add',
          tooltip:'末尾增加一行',
          onclick: function() {
            jRef?.current?.jexcel.insertRow();
          }
      },
      {
        type: 'i',
        content: 'remove',
        tooltip:'删除选中行',
        onclick: function() {
          jRef?.current?.jexcel.deleteRow()
        }
    },
      {
          type: 'i',
          content: 'publish',
          tooltip:'在此前插入行',
          onclick: function() {
            const selectedRows = jRef?.current?.jexcel.getSelectedRows();
            console.log('publish',selectedRows)

            if(!selectedRows||!selectedRows[0]?.dataset){
              alert('未选中行');
              return;
            }
            jRef?.current?.jexcel.insertRow(1, parseInt(selectedRows[0].dataset.y), 1);

          }
      },
      {
          type: 'i',
          content: 'get_app',
          tooltip:'在此后插入行',
          onclick: function() {
            const selectedRows = jRef?.current?.jexcel.getSelectedRows();
            console.log('get_app',selectedRows)

            if(!selectedRows||!selectedRows[selectedRows.length-1]?.dataset){
              alert('未选中行');
              return;
            }
            jRef?.current?.jexcel.insertRow(1, parseInt(selectedRows[selectedRows.length-1].dataset.y));
          }
      },
      {
        type: 'i',
        content: 'help_outline',
        tooltip:'使用说明',
        onclick: function() {

        }
    },
  ],
    text:{
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
    about:false,

  };

  useEffect(() => {
    if (!jRef?.current?.jspreadsheet) {
      jspreadsheet(jRef.current, options);
    }
  }, [options]);

  const addRow = () => {
    jRef?.current?.jexcel.insertRow();
  };

  return (

      <div ref={jRef} />
  );
}

export default JExcel
