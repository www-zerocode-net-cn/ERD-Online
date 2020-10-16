import React from 'react';

import { Checkbox, Input, Icon, openModal } from '../../../components';

import './style/indexConfig.less';
import { uuid } from '../../../utils/uuid';
import {moveArrayPosition, moveArrayPositionByFuc} from '../../../utils/array';
import ImportFields from './ImportFields';

export default class TableIndexConfig extends React.Component{
  constructor(props){
    super(props);
    this.emptyData = [];
    this.state = {
      selectedIndexs: [],
      selectedFields: [],
      dataTable: this._getDataTable(props),
    };
  }
  componentWillReceiveProps(nextProps){
    // 如果当前Tab为刚刚激活的状态，则需要判断dataTable是否需要更新
    if ((nextProps.tabShow === 'indexs') && (this.props.tabShow !== nextProps.tabShow)) {
      this.setState({
        dataTable: {
          ...this._getDataTable(nextProps),
          indexs: this.state.dataTable.indexs || [],
        },
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    return (nextState.dataTable !== this.state.dataTable)
      || (nextState.selectedIndexs !== this.state.selectedIndexs)
      || (nextState.selectedFields !== this.state.selectedFields)
      || ((nextState.dataTable.indexs || this.emptyData)
        !== (this.state.dataTable.indexs || this.emptyData));
  }
  getData = () => {
    return this.state.dataTable.indexs || [];
  };
  update = (dataTable) => {
    this.setState({
      dataTable,
    });
  };
  _getDataTable = (props) => {
    const { getDataTable } = props;
    return getDataTable && getDataTable();
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
  _getStyle = (code) => {
    let minWidth = code === 'Input' ? 200 : '100%';
    let width = (code === 'Input') ? '100%' : 'auto';
    return {
      minWidth,
      width,
    };
  };
  _onDragStart = (e, value, status) => {
    e.stopPropagation();
    e.dataTransfer.setData('Text', value);
    this.status = status;
  };
  _onDrop = (e, index, status, key) => {
    e.preventDefault();
    if (this.status === status) {
      const data = e.dataTransfer.getData('Text');
      const { dataTable } = this.state;
      let tempDatable = {...dataTable};
      if (this.status === 'fields') {
        tempDatable = {
          ...dataTable,
          indexs: (dataTable.indexs || []).map((d) => {
            if (d.key === key) {
              return {
                ...d,
                fields: moveArrayPosition(d.fields || [], data, index),
              };
            }
            return d;
          }),
        };
      } else {
        tempDatable = {
          ...dataTable,
          indexs: moveArrayPosition(dataTable.indexs || [], data, index),
        };
      }
      this.update(tempDatable);
    }
  };
  _onDragOver = (e) => {
    e.preventDefault();
  };
  _trClick = (e, key, type) => {
    e.stopPropagation();
    e.preventDefault();
    const name = type === 'fields' ? 'selectedFields' : 'selectedIndexs';
    const selectedIndexs = this.state[name];
    let tempSelectedTrs = [...selectedIndexs];
    if (tempSelectedTrs.some(tr => tr === key)) {
      tempSelectedTrs = e.shiftKey ? tempSelectedTrs.filter(tr => tr !== key) : [];
    } else {
      e.shiftKey ? tempSelectedTrs.push(key) : tempSelectedTrs = [key];
    }
    this.setState({
      [name]: tempSelectedTrs,
    });
  };
  _moveIndex = (type) => {
    const { selectedIndexs, dataTable } = this.state;
    let tempFields = [...(dataTable.indexs || [])];
    const selectedTrsIndex = tempFields
      .map((field, index) => {
        if (selectedIndexs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null);
    const maxIndex = Math.max(...selectedTrsIndex);
    const minIndex = Math.min(...selectedTrsIndex);
    let changeIndex = type === 'up' ? minIndex - 1 : maxIndex + 1;
    if (changeIndex >= 0 && changeIndex <= tempFields.length - 1) {
      // 获取将要插入位置的属性
      // const changeField = tempFields[changeIndex];
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
      this.update({
        ...dataTable,
        indexs: tempFields,
      });
    }
  };
  _deleteIndex = () => {
    const { selectedIndexs, dataTable } = this.state;
    // 获取上一行
    let tempFields = [...(dataTable.indexs || [])];
    const minIndex = Math.min(...tempFields
      .map((field, index) => {
        if (selectedIndexs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null));
    const newFields = (dataTable.indexs || []).filter(fid => !selectedIndexs.includes(fid.key));
    this.update({
      ...dataTable,
      indexs: newFields,
    });
    const selectField = newFields[(minIndex - 1) < 0 ? 0 : minIndex - 1];
    this.setState({
      selectedIndexs: (selectField && [selectField.key]) || [],
    });
  };
  _addIndex = () => {
    const { selectedIndexs, dataTable } = this.state;
    const tempIndexs = dataTable.indexs || [];
    const selectedTrsIndex = tempIndexs
      .map((field, index) => {
        if (selectedIndexs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null);
    const name = this._getFieldName(dataTable.indexs || [], 'untitled');
    const newIndex = {
      name: name,
      isUnique: false,
      fields: [],
      key: `${uuid()}-${name}`,
    };
    if (selectedTrsIndex.length > 0) {
      tempIndexs.splice(Math.max(...selectedTrsIndex) + 1, 0, newIndex);
    } else {
      tempIndexs.push(newIndex);
    }
    const tempDatable = {
      ...dataTable,
      indexs: tempIndexs,
    };
    this.update(tempDatable);
  };
  _inputOnChange = (e, key, type) => {
    const { dataTable } = this.state;
    this.update({
      ...dataTable,
      indexs: (dataTable.indexs || []).map((field) => {
        if (field.key === key) {
          return {
            ...field,
            [type]: e.target.value,
          };
        }
        return field;
      }),
    });
  };
  _importField = (fields, key) => {
    const { dataTable } = this.state;
    openModal(<ImportFields dataTable={dataTable} fields={fields}/>, {
      title: '引入字段',
      onOk: (modal, com) => {
        const newFields = com.getFields();
        this.update({
          ...dataTable,
          indexs: (dataTable.indexs || []).map((d) => {
            if (d.key === key) {
              return {
                ...d,
                fields: (d.fields || []).concat(newFields.map(f => f.name)),
              };
            }
            return d;
          }),
        });
        modal && modal.close();
      },
    });
  };
  _moveField = (type, key) => {
    const { dataTable } = this.state;
    const { selectedFields } = this.state;
    const indexData = (dataTable.indexs || []).filter(d => d.key === key)[0];
    let tempFields = [...((indexData && indexData.fields) || [])];
    const selectedTrsIndex = tempFields
      .map((field, index) => {
        if (selectedFields.includes(field)) {
          return index;
        }
        return null;
      }).filter(field => field !== null);
    const maxIndex = Math.max(...selectedTrsIndex);
    const minIndex = Math.min(...selectedTrsIndex);
    let changeIndex = type === 'up' ? minIndex - 1 : maxIndex + 1;
    if (changeIndex >= 0 && changeIndex <= tempFields.length - 1) {
      // 获取将要插入位置的属性
      // const changeField = tempFields[changeIndex];
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
              return f === field.from;
            }, type === 'up' ? field.fieldIndex - 1 : field.fieldIndex + 1);
        });
    }
    this.update({
      ...dataTable,
      indexs: (dataTable.indexs || []).map((d) => {
        if (d.key === key) {
          return {
            ...d,
            fields: tempFields,
          };
        }
        return d;
      }),
    });
  };
  _deleteField = (key) => {
    const { selectedFields, dataTable } = this.state;
    const indexData = (dataTable.indexs || []).filter(d => d.key === key)[0];
    let tempFields = [...((indexData && indexData.fields) || [])];
    // 获取上一行
    const minIndex = Math.min(...tempFields
      .map((field, index) => {
        if (selectedFields.includes(field)) {
          return index;
        }
        return null;
      }).filter(field => field !== null));
    const newFields = tempFields.filter(fid => !selectedFields.includes(fid));
    this.update({
      ...dataTable,
      indexs: (dataTable.indexs || []).map((d) => {
        if (d.key === key) {
          return {
            ...d,
            fields: newFields,
          };
        }
        return d;
      }),
    });
    const selectField = newFields[(minIndex - 1) < 0 ? 0 : minIndex - 1];
    this.setState({
      selectedFields: (selectField && [selectField.key]) || [],
    });
  };
  render(){
    const { selectedIndexs = [], selectedFields = [], dataTable } = this.state;
    const { prefix = 'pdman', height } = this.props;
    const dataFields = dataTable.fields || [];
    // 显示最后点击的索引的字段
    const key = selectedIndexs && selectedIndexs[selectedIndexs.length - 1];
    let indexField = {};
    if (key) {
      indexField = (dataTable.indexs || []).filter(dt => dt.key === key)[0];
    }
    // 获取完整的属性信息
    const fields = ((indexField && indexField.fields) || [])
      .map(name => dataFields.filter(dt => name === dt.name)[0]).filter(field => !!field);
    const { indexs = [] } = dataTable;
    return (<div className='pdman-table-index-config'>
      <div className='pdman-table-index-config-left'>
        <div className={`${prefix}-data-table-content-table-opt-icon`}>
          <Icon
            onClick={() => selectedIndexs.length !== 0 && this._moveIndex('up')}
            className={selectedIndexs.length === 0 ? `${prefix}-data-table-content-table-disabled-icon` :
              `${prefix}-data-table-content-table-normal-icon`}
            type="fa-long-arrow-up"
          />
          <Icon
            onClick={() => selectedIndexs.length !== 0 && this._moveIndex('bottom')}
            className={selectedIndexs.length === 0 ?
              `${prefix}-data-table-content-table-disabled-icon`
              : `${prefix}-data-table-content-table-normal-icon`}
            type="fa-long-arrow-down"
          />
          <Icon
            onClick={() => selectedIndexs.length !== 0 && this._deleteIndex()}
            className={selectedIndexs.length === 0 ?
              `${prefix}-data-table-content-table-disabled-icon`
              : `${prefix}-data-table-content-table-normal-icon`}
            type="fa-minus"
          />
          <Icon
            onClick={() => this._addIndex()}
            className={`${prefix}-data-table-content-table-normal-icon`}
            type="fa-plus"
          />
        </div>
        <div className='pdman-table-index-config-left-list' style={{height: height - 190, overflow: 'auto'}}>
          <table
            style={{minWidth: 200}}
            tabIndex="0"
            className={`${prefix}-data-table-content-table`}
          >
            <tbody>
              <tr className={`${prefix}-data-table-content-table-first-tr`}>
                <th>{}</th>
                <th>索引名</th>
                <th>是否唯一</th>
              </tr>
              {
                indexs.map((data, index) => (
                  <tr
                    onClick={e => this._trClick(e, data.key, 'indexs')}
                    draggable
                    onDragStart={e => this._onDragStart(e, index, 'indexs')}
                    onDrop={e => this._onDrop(e, index, 'indexs')}
                    onDragOver={this._onDragOver}
                    key={data.key}
                    className={`${prefix}-data-table-content-table-normal-tr
                        ${selectedIndexs.some(tr => tr === data.key) ?
                    `${prefix}-data-table-content-table-selected-tr` :
                    `${prefix}-data-table-content-table-unselected-tr`}`}>
                    <th style={{width: 35, userSelect: 'none'}}>{index + 1}</th>
                    <th>
                      <Input
                        onChange={e => this._inputOnChange(e, data.key, 'name')}
                        value={data.name || ''}
                        style={{
                          height: 23,
                          ...this._getStyle('Input'),
                        }}
                      />
                    </th>
                    <th>
                      <Checkbox
                        onChange={e => this._inputOnChange(e, data.key, 'isUnique')}
                        value={data.isUnique || false}
                        style={{
                          height: 15,
                          ...this._getStyle('Checkbox'),
                        }}
                      />
                    </th>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
      <div className='pdman-table-index-config-right' style={{display: key ? '' : 'none'}}>
        <div className={`${prefix}-data-table-content-table-opt-icon`}>
          <Icon
            onClick={() => selectedFields.length !== 0 && this._moveField('up', key)}
            className={selectedFields.length === 0 ? `${prefix}-data-table-content-table-disabled-icon` :
              `${prefix}-data-table-content-table-normal-icon`}
            type="fa-long-arrow-up"
          />
          <Icon
            onClick={() => selectedFields.length !== 0 && this._moveField('bottom', key)}
            className={selectedFields.length === 0 ?
              `${prefix}-data-table-content-table-disabled-icon`
              : `${prefix}-data-table-content-table-normal-icon`}
            type="fa-long-arrow-down"
          />
          <Icon
            onClick={() => selectedFields.length !== 0 && this._deleteField(key)}
            className={selectedFields.length === 0 ?
              `${prefix}-data-table-content-table-disabled-icon`
              : `${prefix}-data-table-content-table-normal-icon`}
            type="fa-minus"
          />
          <Icon
            onClick={() => this._importField(fields, key)}
            className={`${prefix}-data-table-content-table-normal-icon`}
            type="fa-plus"
          />
        </div>
        <div className='pdman-table-index-config-right-list'>
          <table
            style={{minWidth: 200}}
            tabIndex="0"
            className={`${prefix}-data-table-content-table`}
          >
            <tbody>
              <tr className={`${prefix}-data-table-content-table-first-tr`}><th>{}</th><th>代码</th><th>名称</th></tr>
              {
                fields
                  .map((f, index) => (
                    <tr
                      onClick={e => this._trClick(e, f.name, 'fields')}
                      draggable
                      onDragStart={e => this._onDragStart(e, index, 'fields')}
                      onDrop={e => this._onDrop(e, index, 'fields', key)}
                      onDragOver={this._onDragOver}
                      className={`${prefix}-data-table-content-table-normal-tr
                        ${selectedFields.some(tr => tr === f.name) ?
                        `${prefix}-data-table-content-table-selected-tr` :
                        `${prefix}-data-table-content-table-unselected-tr`}`}
                      key={f.key}
                    >
                      <th style={{width: 35, userSelect: 'none'}}>{index + 1}</th>
                      <th><span>{f.name}</span></th><th><span>{f.chnname}</span></th>
                    </tr>
                    ),
                  )
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>);
  }
}
