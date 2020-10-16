import React from 'react';
import ReactDom from 'react-dom';
import _object from 'lodash/object';
import * as Com from '../components';
import defaultData from './defaultData';
import JavaHomeConfig from './JavaHomeConfig';
import SQLConfig from './SQLConfig';
import WORDConfig from './WORDConfig';
//import Register from './Register';

import './style/setting.less';
import { uuid } from '../utils/uuid';
import { moveArrayPositionByFuc, moveArrayPosition } from '../utils/array';
import DataTypeHelp from './container/datatype/help';

const { Modal, openModal, TextArea, Select, openMask } = Com;

export default class Setting extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      tabShow: 'fields',
      selectedTrs: [],
      height: 'calc(100% - 110px)',
      fields: this._initFields(_object.get(props.dataSource, 'profile.defaultFields', defaultData.profile.defaultFields)),
      defaultFieldsType: _object.get(props.dataSource, 'profile.defaultFieldsType', '1'),
    };
    this.inputInstance = [];
    this.javaConfig = _object.get(props.dataSource, 'profile.javaConfig', {});
    this.sqlConfig = _object.get(props.dataSource, 'profile.sqlConfig', ';');
    this.wordTemplateConfig = _object.get(props.dataSource, 'profile.wordTemplateConfig', '');
    this.dbs = _object.get(props.dataSource, 'profile.dbs', []);
  }
  componentDidMount(){
    this.dom = ReactDom.findDOMNode(this.instance);
   /* eslint-disable */
    this.setState({
      height: this.dom.getBoundingClientRect().height,
    });
  }
  getDataSource = () => {
    // 返回整个dataSource
    const { dataSource } = this.props;
    const { fields, defaultFieldsType } = this.state;
    return {
      ...dataSource,
      profile: {
        defaultFields: fields.map(field => _object.omit(field, ['key'])),
        defaultFieldsType,
        javaConfig: this.javaConfig,
        sqlConfig: this.sqlConfig,
        dbs: this.dbs,
        wordTemplateConfig: this.wordTemplateConfig,
      }
    };
  };
  _initFields = (fields = []) => {
    return fields.map(field => ({...field, key: `${uuid()}-${field.name}`}));
  };
  _saveData = (fields) => {
    this.setState({
      fields,
    });
  };
  _deleteField = () => {
    const { fields, selectedTrs } = this.state;
    let tempFields = [...(fields || [])];
    const minIndex = Math.min(...tempFields
      .map((field, index) => {
        if (selectedTrs.includes(field.key)) {
          return index;
        }
        return null;
      }).filter(field => field !== null));
    const newFields = (fields || []).filter(fid => !selectedTrs.includes(fid.key));
    const selectField = newFields[(minIndex - 1) < 0 ? 0 : minIndex - 1];
    this.setState({
      selectedTrs: (selectField && [selectField.key]) || [],
    });
    this._saveData(newFields);
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
    const { fields, selectedTrs } = this.state;
    const { dataSource } = this.props;
    const dataTypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    const fieldName = this._getFieldName(fields, 'untitled');
    const tempFields = [...fields];
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
    this._saveData(tempFields);
  };
  _inputOnChange = (e, key, type) => {
    // console.log(e, module, table, tempField, type);
    let notNull = {};
    if (type === 'pk') {
      notNull = {
        notNull: e.target.value,
      };
    }
    const { fields } = this.state;
    this._saveData(fields.map((field) => {
        if (field.key === key) {
          return {
            ...field,
            [type]: e.target.value,
            ...notNull,
          };
        }
        return field;
      }));
  };
  _checkBoxOnChange = (e, fieldName) => {
    const { fields } = this.state;
    this._saveData((fields || []).map((header) => {
        if (header.fieldName === fieldName) {
          return {
            ...header,
            relationNoShow: e.target.value,
          };
        }
        return header;
      }));
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
  _onFocus = (trIndex, tdIndex) => {
    this.inputPosition = {
      x: tdIndex,
      y: trIndex,
    };
  };
  _onKeyDown = (e) => {
    // c 67
    // v 86
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
      if (e.ctrlKey || e.metaKey) {
        const { selectedTrs, fields } = this.state;
        if (e.keyCode === 67) {
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
            const tempData ='';
            if (this._checkFields(tempData)) {
              const fieldNames = (fields || []).map(field => field.name);
              const copyFields = tempData.map((field) => {
                const name = this._checkFieldName(fieldNames, field.name);
                return {
                  ...field,
                  name: name,
                  key: `${uuid()}-${field.name}`,
                };
              });
              const tempFields = fields || [];
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
              this._saveData(tempFields);
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
        //let dom = null;
        if (e.keyCode === 38 && y - 1 > -1) {
          // 将光标放置上一行
          //dom = ReactDom.findDOMNode(this.inputInstance[y - 1][x].focus());
          this.inputInstance[y - 1][x].select();
        } else if (e.keyCode === 40 && y + 1 < this.inputInstance.length){
          // 将光标放置下一行
          this.inputInstance[y + 1][x].select();
          //dom = ReactDom.findDOMNode(this.inputInstance[y + 1][x]);
        }
        //console.log(dom);
        //dom && dom.focus();
      }
    }
  };
  _onDragStart = (e, value) => {
    e.stopPropagation();
    e.dataTransfer.setData('Text', value);
  };
  _onDrop = (e, index) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('Text');
    const { fields } = this.state;
    this._saveData(moveArrayPosition(fields, data, index));
  };
  _onDragOver = (e) => {
    e.preventDefault();
  };
  _trClick = (e, key) => {
    e.stopPropagation();
    e.preventDefault();
    const { selectedTrs } = this.state;
    let tempSelectedTrs = [...selectedTrs];
    if (tempSelectedTrs.some(tr => tr === key)) {
      tempSelectedTrs = e.shiftKey ? tempSelectedTrs.filter(tr => tr !== key) : [];
    } else {
      e.shiftKey ? tempSelectedTrs.push(key) : tempSelectedTrs = [key];
    }
    this.setState({
      selectedTrs: tempSelectedTrs,
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
  _moveField = (type) => {
    const { fields, selectedTrs } = this.state;
    let tempFields = [...fields];
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
      // const changeField = tempFields[changeIndex];
      // 统计每一条数据插入的位置对应的数据
      // 循环移动每一条数据
      selectedTrsIndex.map(fieldIndex => ({
        fieldIndex,
        from: tempFields[fieldIndex],
      })).sort((a, b) => type === 'up' ? a.fieldIndex - b.fieldIndex : b.fieldIndex - a.fieldIndex )
        .forEach((field) => {
        tempFields = moveArrayPositionByFuc(
          tempFields,  (f) => {
            return f.key === field.from.key;
          }, type === 'up' ? field.fieldIndex - 1 : field.fieldIndex + 1);
      });
      this._saveData(tempFields);
    }
  };
  _checkFieldName = (fields, field) => {
    if (fields.includes(field)) {
      return this._checkFieldName(fields, `${field}1`);
    }
    return field;
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
        title: '备注详情',
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
  _tabClick = (tabShow) => {
    this.setState({
      tabShow,
    });
  };
  _defaultFieldsTypeChange = (e) => {
    const type = e.target.value;
    this.setState({
      defaultFieldsType: type,
      fields: this.state.fields.map(f => {
        let name = f.name;
        if (type === '1') {
          name = name.toLocaleUpperCase();
        } else if (type === '2') {
          name = name.toLocaleLowerCase();
        }
        return {
          ...f,
          name,
        }
      }),
    });
  };
  _javaHomeChange = (data) => {
    this.javaConfig = data;
  };
  _sqlSeparatorChange = (data) => {
    this.sqlConfig = data;
  };
  _wordTemplateChange = (data) => {
    this.wordTemplateConfig = data;
  };
  _getOptions = (dataTypes, type) => {
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
  _showCreateType = () => {
    openMask(<DataTypeHelp/>);
  };
  render(){
    const { height, selectedTrs, fields, defaultFieldsType } = this.state;
    const { prefix = 'pdman', columnOrder, dataSource, project, register, updateRegister } = this.props;
    const dataTypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    return (<div className={`${prefix}-data-table-content`} ref={instance => this.instance = instance}>
      <div className={`${prefix}-data-table-content-tab`}>
        <div
          onClick={() => this._tabClick('fields')}
          className={`${prefix}-data-table-content-tab${this.state.tabShow === 'fields' ? '-selected' : '-unselected'}`}
        >默认属性
        </div>
        <div
          onClick={() => this._tabClick('java')}
          className={`${prefix}-data-table-content-tab${this.state.tabShow === 'java' ? '-selected' : '-unselected'}`}
        >JAVA环境配置</div>
        <div
          onClick={() => this._tabClick('SQL')}
          className={`${prefix}-data-table-content-tab${this.state.tabShow === 'SQL' ? '-selected' : '-unselected'}`}
        >SQL分隔符配置</div>
        <div
          onClick={() => this._tabClick('word')}
          className={`${prefix}-data-table-content-tab${this.state.tabShow === 'word' ? '-selected' : '-unselected'}`}
        >WORD模板配置</div>
        {/*<div*/}
          {/*onClick={() => this._tabClick('register')}*/}
          {/*className={`${prefix}-data-table-content-tab${this.state.tabShow === 'register' ? '-selected' : '-unselected'}`}*/}
        {/*>注册激活</div>*/}
      </div>
      <div className={`${prefix}-data-tab-content`}>
        <div style={{ width: '100%', display: this.state.tabShow === 'fields' ? '' : 'none' }}>
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
            <span className={`${prefix}-setting-defaultfieldstype`}>
              <Select
                value={defaultFieldsType}
                onChange={this._defaultFieldsTypeChange}>
              >
                <option value='1'>逻辑名大写</option>
                <option value='2'>逻辑名小写</option>
              </Select>
            </span>
            <span
              className={`${prefix}-warring`}
            >（注意：修改默认属性数据后只会对后续新建的数据表生效，对已经存在的数据表无效）
            </span>
          </div>
          <div style={{height: height, overflow: 'auto'}}>
            <table
              tabIndex="0"
              onKeyDown={e => this._onKeyDown(e)}
              className={`${prefix}-data-table-content-table`}
            >
              <tbody>
              <tr className={`${prefix}-data-table-content-table-first-tr`}>
                <th>{}</th>
                {
                  columnOrder.map((column) => {
                    return (<th key={column.code}>
                      <div>
                        <div>
                          {column.value}
                          <Com.Icon
                            title='创建新的数据类型'
                            onClick={this._showCreateType}
                            type='fa-question-circle-o'
                            style={{display: column.code === 'type' ? '' : 'none', color: 'green'}}
                          />
                          {
                            column.code !== 'relationNoShow' &&
                            <Com.Icon
                              style={{ marginLeft: 5 }}
                              type={column.relationNoShow ? 'fa-eye-slash' : 'fa-eye'}
                              onClick={e => this._relationNoShowClick(e, '', column.code, !column.relationNoShow)}
                              title='是否在关系图中显示'
                            />}
                        </div>
                      </div>
                    </th>);
                  })
                }
              </tr>
              {
                fields.map((field, index) => (
                  <tr
                    onClick={e => this._trClick(e, field.key)}
                    draggable
                    onDragStart={e => this._onDragStart(e, index)}
                    onDrop={e => this._onDrop(e, index)}
                    onDragOver={this._onDragOver}
                    className={`${prefix}-data-table-content-table-normal-tr
                        ${selectedTrs.some(tr => tr === field.key) ? `${prefix}-data-table-content-table-selected-tr` : ''}`}
                    key={field.key}
                  >
                    <th style={{width: 35, userSelect: 'none'}}>{index + 1}</th>
                    {
                      columnOrder.map((column, rowIndex) => {
                        const ThCom = Com[column.com || 'Input'];
                        if (column.com === 'Icon') {
                          return (
                            <th key={`${column.code}-${field.key}`} style={{textAlign: 'center'}}>
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
                        return (
                          <th key={`${column.code}-${field.key}`}>{
                            <ThCom
                              //disabled={(column.code === 'notNull') && field.pk}
                              suffix={column.code === 'remark' ?
                                <span onClick={() => this._openRemark(field[column.code], field.key)}>...</span> : ''}
                              ref={(instance) => {
                                if (column.com === 'Input') {
                                  if (!this.inputInstance[index]) {
                                    this.inputInstance[index] = [];
                                  }
                                  this.inputInstance[index][rowIndex] = instance;
                                }
                              }}
                              onFocus={() => column.com === 'Input' && this._onFocus(index, rowIndex)}
                              onChange={e => this._inputOnChange(e, field.key, column.code)}
                              value={field[column.code] || ''}
                              style={{
                                height: (column.code !== 'pk' && column.code !== 'notNull' && column.code !== 'autoIncrement')  ? 23 : 15,
                                ...this._getStyle(column.code)
                              }}
                            >
                              {
                                column.com === 'Select' && this._getOptions(dataTypes, column.code)
                              }
                            </ThCom>
                          }</th>);
                      })
                    }
                  </tr>
                ))
              }
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ width: '100%', display: this.state.tabShow === 'java' ? '' : 'none' }}>
          <JavaHomeConfig onChange={this._javaHomeChange} data={this.javaConfig} project={project}/>
        </div>
        <div style={{ width: '100%', display: this.state.tabShow === 'SQL' ? '' : 'none' }}>
          <SQLConfig onChange={this._sqlSeparatorChange} data={this.sqlConfig}/>
        </div>
        <div style={{ width: '100%', display: this.state.tabShow === 'word' ? '' : 'none' }}>
          <WORDConfig onChange={this._wordTemplateChange} data={this.wordTemplateConfig}/>
        </div>
        {/*<div style={{ width: '100%', display: this.state.tabShow === 'register' ? '' : 'none' }}>*/}
          {/*<Register dataSource={this.props.dataSource} register={register} updateRegister={updateRegister}/>*/}
        {/*</div>*/}
      </div>
    </div>);
  }
}
