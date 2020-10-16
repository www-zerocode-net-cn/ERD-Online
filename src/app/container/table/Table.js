import React from 'react';
import _object from 'lodash/object';

import * as Com from '../../../components';
import TableRow from './TableRow';
import { uuid } from '../../../utils/uuid';
import { moveArrayPositionByFuc } from '../../../utils/array';
import DataTypeHelp from '../datatype/help';

const { Modal, openMask }  = Com;

export default class Table extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataTable: props.dataTable,
      selectedTrs: [],
    };
    this.inputInstance = [];
    this.inputPosition = {};
    // 构造当前组件通用空数组
    this.emptyArray = [];
  }
  shouldComponentUpdate(nextProps, nextState){
    // 1.全局数据类型发生改变【columnOrder = [], dataTypes = []】
    // 2.当前的数据表发生变化
    return (nextProps.columnOrder !== this.props.columnOrder)
      || (nextProps.dataTypes !== this.props.dataTypes)
      || (nextState.dataTable !== this.state.dataTable)
      || nextProps.height !== this.props.height
      || nextState.selectedTrs !== this.state.selectedTrs;
  }
  getData = () => {
    return this.state.dataTable;
  };
  _saveData = (data) => {
    this.setState({
      dataTable: data,
    });
  };
  _checkFields = (data) => {
    if (Array.isArray(data)) {
      const names = ['name', 'type', 'remark', 'chnname', 'pk', 'relationNoShow', 'key', 'notNull', 'autoIncrement', 'defaultValue', 'uiHint'];
      return data.every(d => d.name && typeof d.name === 'string')
        && data.every(d => Object.keys(d).every(name => names.includes(name)));
    }
    return false;
  };
  _checkFieldName = (fields, field) => {
    if (fields.includes(field)) {
      return this._checkFieldName(fields, `${field}1`);
    }
    return field;
  };
  _onKeyDown = (e) => {
    // c 67
    // v 86
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (e.ctrlKey || e.metaKey) {
        const { selectedTrs, dataTable } = this.state;
        if (e.keyCode === 67) {
          const { fields = [] } = dataTable;
          const clipboardData = fields
            .filter(field => selectedTrs.includes(field.key))
            .map(field => ({...field, key: `${uuid()}-${field.name}`}));
          if (clipboardData.length === 0) {
            Modal.error({title: '复制无效', message: '未选中属性', width: 200});
            return;
          }
          Com.Message.success({title: '数据表列已经成功复制到粘贴板'});
        } else if(e.keyCode === 86) {
          try {
            const tempData = '';
            if (this._checkFields(tempData)) {
              const fieldNames = (dataTable.fields || []).map(field => field.name);
              const copyFields = tempData.map((field) => {
                const name = this._checkFieldName(fieldNames, field.name);
                return {
                  ...field,
                  name: name,
                  key: `${uuid()}-${field.name}`,
                };
              });
              const tempFields = dataTable.fields || [];
              if (selectedTrs && selectedTrs.length > 0) {
                const selectedTrsIndex = tempFields
                  .map((field, index) => {
                    if (selectedTrs.includes(field.key)) {
                      return index;
                    }
                    return null;
                  }).filter(field => field !== null);
                const maxIndex = Math.max(...selectedTrsIndex);
                tempFields.splice(maxIndex + 1, 0, ...copyFields);
              } else {
                tempFields.push(...copyFields);
              }
              this._saveData({
                ...dataTable,
                fields: tempFields,
              });
            } else {
              Modal.error({title: '粘贴失败', message: '无效的数据', width: 200});
            }
          } catch (err) {
            console.log(err);
            Modal.error({title: '粘贴失败', message: '无效的数据', width: 200});
          }
        }
      }
    } else if (e.keyCode === 40 || e.keyCode === 38){
      // 处理键盘上下箭头，判断光标是在最前还是最后
      if ((e.target.selectionEnd === (e.target.value && e.target.value.length))
        || (e.target.selectionEnd === 0)) {
        // 当前所在的坐标;
        const x = this.inputPosition.x;
        const y = this.inputPosition.y;
        if (e.keyCode === 38 && y - 1 > -1) {
          // 将光标放置上一行
          this.inputInstance[y - 1][x].select();
        } else if (e.keyCode === 40 && y + 1 < this.inputInstance.length){
          // 将光标放置下一行
          this.inputInstance[y + 1][x].select();
        }
      }
    }
  };
  _columnClick = (type, index) => {
    const { dataTable } = this.state;
    const headers = dataTable.headers;
    const changeIndex = type === 'left' ? index - 1 : index + 1;
    const changeHeader = headers[changeIndex];
    const selectHeader = headers[index];
    this._saveData({
      ...dataTable,
      headers: headers.map((header, headerIndex) => {
        if (headerIndex === index) {
          return changeHeader;
        } else if (headerIndex === changeIndex) {
          return selectHeader;
        }
        return header;
      }),
    });
  };
  _inputOnChange = (e, key, type) => {
    let notNull = {};
    if (type === 'pk') {
      notNull = {
        notNull: e.target.value,
      };
    }
    const { dataTable } = this.state;
    this._saveData({
      ...dataTable,
      fields: (dataTable.fields || []).map((field) => {
        if (field.key === key) {
          return {
            ...field,
            [type]: e.target.value,
            ...notNull,
          };
        }
        return field;
      }),
    });
  };
  _checkBoxOnChange = (e, fieldName) => {
    const { dataTable } = this.state;
    this._saveData({
      ...dataTable,
      headers: (dataTable.headers || []).map((header) => {
        if (header.fieldName === fieldName) {
          return {
            ...header,
            relationNoShow: e.target.value,
          };
        }
        return header;
      }),
    });
  };
  _showCreateType = () => {
    openMask(<DataTypeHelp/>);
  };
  _relationNoShowClick = (e, key, code, value) => {
    if (key) {
      // 修改属性的显示状态
      this._inputOnChange({
        ...e,
        target: {
          ...e.target,
          value,
        },
      }, key, code);
    } else {
      // 修改列的显示状态
      this._checkBoxOnChange({
        ...e,
        target: {
          ...e.target,
          value,
        },
      }, code);
    }
  };
  _deleteInputInstance = (indexs) => {
    this.inputInstance =
      this.inputInstance
        .filter((instances, index) => !indexs.includes(index));
  };
  _setInputInstance = (index, rowIndex, instance) => {
    if (!this.inputInstance[index]) {
      this.inputInstance[index] = [];
    }
    this.inputInstance[index][rowIndex] = instance;
  };
  _updateSelectedTrs = (selectedTrs) => {
    this.setState({
      selectedTrs,
    });
  };
  _updateInputPosition = (position) => {
    this.inputPosition = position;
  };
  _moveField = (type) => {
    const { dataTable, selectedTrs } = this.state;
    let tempFields = [...(dataTable.fields || [])];
    const selectedTrsIndex = tempFields
      .map((field, index) => {
        if (selectedTrs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null);
    const maxIndex = Math.max(...selectedTrsIndex);
    const minIndex = Math.min(...selectedTrsIndex);
    let changeIndex = type === 'up' ? minIndex - 1 : maxIndex + 1;
    if (changeIndex >= 0 && changeIndex <= tempFields.length - 1) {
      // 获取将要插入位置的属性
      // 循环移动每一条数据
      selectedTrsIndex.map(fieldIndex => ({
        fieldIndex,
        from: tempFields[fieldIndex],
        to: tempFields[type === 'up' ? fieldIndex - 1 : fieldIndex + 1],
      }))
        .sort((a, b) => (type === 'up' ? a.fieldIndex - b.fieldIndex : b.fieldIndex - a.fieldIndex))
        .forEach((field) => {
          tempFields = moveArrayPositionByFuc(
            tempFields,  (f) => {
              return f.key === field.from.key;
            }, type === 'up' ? field.fieldIndex - 1 : field.fieldIndex + 1);
        });
      this._saveData({
        ...dataTable,
        fields: tempFields,
      });
    }
  };
  _deleteField = () => {
    const { dataTable, selectedTrs } = this.state;
    // 获取上一行
    let tempFields = [...(dataTable.fields || [])];
    const allIndex = tempFields
      .map((field, index) => {
        if (selectedTrs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null);
    const minIndex = Math.min(...allIndex);
    const newFields = (dataTable.fields || []).filter(fid => !selectedTrs.includes(fid.key));
    this._saveData({
      ...dataTable,
      fields: newFields,
    });
    const selectField = newFields[(minIndex - 1) < 0 ? 0 : minIndex - 1];
    this._deleteInputInstance(allIndex);
    this.setState({
      selectedTrs: (selectField && [selectField.key]) || [],
    });
  };
  _checkUntitledName = (name) => {
    if (!name.split('untitled')[1]) {
      return `${name}1`;
    }
    return `untitled${parseInt(name.split('untitled')[1] || 0, 10) + 1}`;
  };
  _getFieldName = (fields = [], name) => {
    if (fields.some(field => field.name === name)) {
      return this._getFieldName(fields, this._checkUntitledName(name));
    }
    return name;
  };
  _addField = (type) => {
    const { dataTable, selectedTrs } = this.state;
    const { dataSource } = this.props;
    const dataTypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    const fieldName = this._getFieldName(dataTable.fields, 'untitled');
    const tempFields = [...(dataTable.fields || [])];
    const selectedTrsIndex = tempFields
      .map((field, index) => {
        if (selectedTrs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null);
    const newField = {
      name: fieldName,
      type: dataTypes[0].code,
      remark: '',
      chnname: '',
      key: `${uuid()}-${fieldName}`,
    };
    if (type && selectedTrsIndex.length > 0) {
      tempFields.splice(Math.max(...selectedTrsIndex) + 1, 0, newField);
    } else {
      tempFields.push(newField);
    }
    this._saveData({
      ...dataTable,
      fields: tempFields,
    });
  };
  render() {
    const { dataTable, selectedTrs } = this.state;
    const { prefix = 'pdman', columnOrder = this.emptyArray, dataTypes = this.emptyArray, dataSource, height } = this.props;
    const { headers } = dataTable;
    return (
      <div>
        <div className={`${prefix}-data-table-content-table-opt-icon`}>
          <Com.Icon
            onClick={() => selectedTrs.length !== 0 && this._moveField('up')}
            className={selectedTrs.length === 0 ? `${prefix}-data-table-content-table-disabled-icon` :
              `${prefix}-data-table-content-table-normal-icon`}
            type="fa-long-arrow-up"
          />
          <Com.Icon
            onClick={() => selectedTrs.length !== 0 && this._moveField('bottom')}
            className={selectedTrs.length === 0 ?
              `${prefix}-data-table-content-table-disabled-icon`
              : `${prefix}-data-table-content-table-normal-icon`}
            type="fa-long-arrow-down"
          />
          <Com.Icon
            onClick={() => selectedTrs.length !== 0 && this._deleteField()}
            className={selectedTrs.length === 0 ?
              `${prefix}-data-table-content-table-disabled-icon`
              : `${prefix}-data-table-content-table-normal-icon`}
            type="fa-minus"
          />
          <Com.Icon
            onClick={() => this._addField('field')}
            className={`${prefix}-data-table-content-table-normal-icon`}
            type="fa-plus"
          />
        </div>
        <div style={{height: height - 176, overflow: 'auto'}}>
          <table
            tabIndex="0"
            onKeyDown={e => this._onKeyDown(e)}
            className={`${prefix}-data-table-content-table`}
          >
            <tbody>
              <tr className={`${prefix}-data-table-content-table-first-tr`}>
                <th>{}</th>
                {
                  headers.map((header, index) => {
                    const column = columnOrder.filter(c => c.code === header.fieldName)[0];
                    const showLeft = index === 0 ? 'none' : '';
                    const showRight = index === headers.length - 1 ? 'none' : '';
                    return (<th key={column.code}>
                      <div style={{minWidth: column.code === 'type' ? 150 : 'auto' }}>
                        <Com.Icon
                          onClick={() => this._columnClick('left', index)}
                          type='arrowleft'
                          style={{display: showLeft}}
                        />
                        <div>
                          {column.value}
                          {
                            column.code !== 'relationNoShow' &&
                            <Com.Icon
                              style={{ marginLeft: 5 }}
                              type={header.relationNoShow ? 'fa-eye-slash' : 'fa-eye'}
                              onClick={e => this._relationNoShowClick(e, '', column.code, !header.relationNoShow)}
                              title='是否在关系图中显示'
                            />}
                        </div>
                        <Com.Icon
                          title='创建新的数据类型'
                          onClick={this._showCreateType}
                          type='fa-question-circle-o'
                          style={{display: column.code === 'type' ? '' : 'none', color: 'green'}}
                        />
                        <Com.Icon
                          onClick={() => this._columnClick('right', index)}
                          type='arrowright'
                          style={{display: showRight}}
                        />
                      </div>
                    </th>);
                  })
                }
              </tr>
              {
                (dataTable && dataTable.fields || []).map((field, index) => (
                  <TableRow
                    field={field}
                    index={index}
                    key={field.key}
                    dataTypes={dataTypes}
                    headers={headers}
                    columnOrder={columnOrder}
                    selectedTrs={selectedTrs}
                    deleteInputInstance={this._deleteInputInstance}
                    setInputInstance={this._setInputInstance}
                    updateSelectedTrs={this._updateSelectedTrs}
                    saveData={this._saveData}
                    inputOnChange={this._inputOnChange}
                    updateInputPosition={this._updateInputPosition}
                    dataSource={dataSource}
                    dataTable={dataTable}
                    relationNoShowClick={this._relationNoShowClick}
                  />
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
