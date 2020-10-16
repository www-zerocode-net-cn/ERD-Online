import React from 'react';
import _object from 'lodash/object';

import { openModal, TextArea } from '../../../components';

export default class TableCell extends React.Component{
  componentWillReceiveProps(nextProps) {
    const { index, rowIndex, column : { com }, setInputInstance } = nextProps;
    if (com === 'Input' && (index !== this.props.index || rowIndex !== this.props.rowIndex)) {
      setInputInstance && setInputInstance(index, rowIndex, this.instance);
    }
  }
  shouldComponentUpdate(nextProps){
    // 1.判断field[code]是否发生变化
    // 2.判断dataTypes是否发生变化
    // 3.修改字段的数据类型的时候需要更新数据库类型这个字段
    return (nextProps.field[nextProps.column.code] !== this.props.field[this.props.column.code])
      || (nextProps.dataTypes !== this.props.dataTypes
      || (nextProps.column.code === 'dataType' && nextProps.field.type !== this.props.field.type));
  }
  _openRemark = (value, key) => {
    let tempValue = value;
    const remarkChange = (e) => {
      tempValue = e.target.value;
    };
    openModal(
      <TextArea
        style={{height: 150, width: '100%'}}
        defaultValue={tempValue}
        onChange={e => remarkChange(e)}
      />,
      {
        title: '说明详情',
        onOk: (modal) => {
          modal && modal.close();
          this._inputOnChange({
            target: {
              value: tempValue,
            },
          }, key, 'remark');
        },
      },
    );
  };
  _inputOnChange = (e, key, type) => {
    const { inputOnChange } = this.props;
    inputOnChange && inputOnChange(e, key, type);
  };
  _onFocus = () => {
    const { updateInputPosition, index, rowIndex, column : { com } } = this.props;
    if (com === 'Input') {
      updateInputPosition && updateInputPosition({
        x: rowIndex,
        y: index,
      });
    }
  };
  _getDefaultDataType = (type) => {
    const { dataSource } = this.props;
    const database = _object.get(dataSource, 'dataTypeDomains.database', []);
    const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    const defaultDatabase = database.filter(db => db.defaultDatabase)[0];
    const dbCode = (defaultDatabase && defaultDatabase.code) || (database[0] && database[0].code) || '';
    if (dbCode) {
      const current = datatype.filter(dt => dt.code === type)[0] || {};
      const apply = current.apply || {};
      return (apply[dbCode] && apply[dbCode].type) || '';
    }
    return '';
  };
  _getStyle = (code) => {
    let minWidth = '';
    let width = '';
    if (code === 'remark') {
      minWidth = 'calc(100% - 20px)';
      width = 'calc(100% - 20px)';
    } else {
      minWidth = code === 'name' ? 200 : '100%';
      width = (code !== 'pk' && code !== 'notNull' && code !== 'autoIncrement') ? '100%' : 'auto';
    }
    return {
      minWidth,
      width,
    };
  };
  _getOptions = (type) => {
    const { dataTypes } = this.props;
    const data = type === 'type' ? dataTypes : [
      {code: 'Text', name: '文字'},
      {code: 'Number', name: '数字'},
      {code: 'Money', name: '金额'},
      {code: 'Select', name: '下拉框'},
      {code: 'Radio', name: '单选'},
      {code: 'CheckBox', name: '多选'},
      {code: 'Email', name: '邮件'},
      {code: 'URL', name: 'URL'},
      {code: 'DatePicker', name: '日期选择器'},
      {code: 'TextArea', name: '大文本'},
      {code: 'AddressPicker', name: '地址'},
    ];
   return data.concat({
       name: '--请选择--',
       code: '',
     })
       .map(d =>
         (
           <option
             value={d.code}
             key={d.code}
           >
             {d.name}
           </option>
    ));
  };
  render() {
    const { column, field, ThCom, index, rowIndex, setInputInstance } = this.props;
    return (
      <th key={`${column.code}-${field.key}`}>{
        <ThCom
          suffix={column.code === 'remark' ?
            <span onClick={() => this._openRemark(field[column.code], field.key)}>...</span> : ''}
          ref={(instance) => {
            if (column.com === 'Input' && instance) {
              this.instance = instance;
              setInputInstance && setInputInstance(index, rowIndex, instance);
            }
          }}
          onFocus={this._onFocus}
          onChange={e => this._inputOnChange(e, field.key, column.code)}
          value={(column.code === 'dataType' ?
            this._getDefaultDataType(field.type) : field[column.code]) || ''}
          style={{
            height: (column.code !== 'pk' && column.code !== 'notNull' && column.code !== 'autoIncrement') ? 23 : 15,
            ...this._getStyle(column.code),
          }}
        >
          {
            column.com === 'Select' && this._getOptions(column.code)
          }
        </ThCom>
      }</th>
    );
  }
}
