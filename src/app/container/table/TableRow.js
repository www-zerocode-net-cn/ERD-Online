import React from 'react';

import TableCell from './TableCell';
import * as Com from '../../../components';
import { moveArrayPosition } from '../../../utils/array';

// 将列表的行单独做成一个组件，便于渲染判断
export default class TableRow extends React.Component{
  shouldComponentUpdate(nextProps){
    // 列表行渲染判断
    // 1.该行数据是否发生改变
    // 2.该数据表头顺序是否该表
    // 3.选中行是否发生改变
    // 4.全局数据类型发生改变【columnOrder = [], dataTypes = []】
    // 5.表格行发生改变
    return (nextProps.field !== this.props.field)
      || (nextProps.headers !== this.props.headers)
      || this._checkSelected(nextProps)
      || nextProps.columnOrder !== this.props.columnOrder
      || nextProps.dataTypes !== this.props.dataTypes
      || nextProps.index !== this.props.index;
  }
  _checkSelected = (nextProps) => {
    const key = nextProps.field.key;
    const current = this.props.selectedTrs || [];
    const next = nextProps.selectedTrs || [];
    // 判断当前行的选中状态是否发生变化
    const currentIndex = current.findIndex(k => k === key);
    const nextIndex = next.findIndex(k => k === key);
    if (currentIndex === -1 && nextIndex !== -1) {
      return true;
    } else if (currentIndex !== -1 && nextIndex === -1) {
      return true;
    }
    return false;
  };
  _trClick = (e, key) => {
    e.stopPropagation();
    e.preventDefault();
    const { updateSelectedTrs, selectedTrs } = this.props;
    let tempSelectedTrs = [...selectedTrs];
    if (tempSelectedTrs.some(tr => tr === key)) {
      tempSelectedTrs = e.shiftKey ? tempSelectedTrs.filter(tr => tr !== key) : [];
    } else {
      e.shiftKey ? tempSelectedTrs.push(key) : tempSelectedTrs = [key];
    }
    updateSelectedTrs && updateSelectedTrs(tempSelectedTrs);
  };
  _onDragStart = (e, value) => {
    e.stopPropagation();
    e.dataTransfer.setData('Text', value);
  };
  _onDrop = (e, index) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('Text');
    const { dataTable, saveData } = this.props;
    saveData && saveData({
      ...dataTable,
      fields: moveArrayPosition(dataTable.fields, data, index),
    });
  };
  _onDragOver = (e) => {
    e.preventDefault();
  };
  _relationNoShowClick = (e, key, code, value) => {
    const { relationNoShowClick } = this.props;
    relationNoShowClick && relationNoShowClick(e, key, code, value);
  };
  render() {
    const { prefix = 'pdman', field, index, selectedTrs = [],
      headers, columnOrder, dataTypes, setInputInstance,
      inputOnChange, updateInputPosition, dataSource } = this.props;
    return (
      <tr
        onClick={e => this._trClick(e, field.key)}
        draggable
        onDragStart={e => this._onDragStart(e, index)}
        onDrop={e => this._onDrop(e, index)}
        onDragOver={this._onDragOver}
        className={`${prefix}-data-table-content-table-normal-tr
                      ${selectedTrs.some(tr => tr === field.key) ?
          `${prefix}-data-table-content-table-selected-tr` :
          `${prefix}-data-table-content-table-unselected-tr`}`}
        key={field.key}
      >
        <th style={{width: 35, userSelect: 'none'}}>{index + 1}</th>
        {
          headers.map((header, rowIndex) => {
            const column = columnOrder.filter(c => c.code === header.fieldName)[0];
            const ThCom = Com[column.com || 'Input'] || Com.Input;
            if (column.com === 'Icon') {
              return (
                <th key={`${column.code}-${field.key}`}>
                  <ThCom
                    style={{cursor: 'pointer'}}
                    type={field[column.code] ? 'fa-eye-slash' : 'fa-eye'}
                    onClick={e => this._relationNoShowClick(e,
                      field.key, column.code, !field[column.code])}
                    title='是否在关系图中显示'
                  />
                </th>
              );
            }
            return (<TableCell
              key={`${column.code}-${field.key}`}
              rowIndex={rowIndex}
              column={column}
              dataTypes={dataTypes}
              field={field}
              ThCom={ThCom}
              index={index}
              setInputInstance={setInputInstance}
              inputOnChange={inputOnChange}
              updateInputPosition={updateInputPosition}
              dataSource={dataSource}
            />);
          })
        }
      </tr>
    );
  }
}
