import React from 'react';
import _object from 'lodash/object';

import {
  Button,
  Checkbox,
  Editor,
  RadioGroup,
  Select,
  TreeSelect,
  openModal,
  Modal,
  Input,
  Icon,
  Code,
} from '../components';
import { getAllDataSQLByFilter } from '../utils/json2code';
import { addOnResize } from '../../src/utils/listener';
import * as Save from '../utils/save';

const { Radio } = RadioGroup;

export default class ExportSQL extends React.Component{
  constructor(props){
    super(props);
    const { exportSqlDefault = {} } = props.configJSON || {};
    this.state = {
      selectTable: null,
      export: 'all',
      defaultDb: props.defaultDb,
      type: {
        deleteTable: exportSqlDefault.deleteTable || false,
        createTable: exportSqlDefault.createTable || false,
        createIndex: exportSqlDefault.createIndex || false,
        updateComment: exportSqlDefault.updateComment || false,
      },
      data: getAllDataSQLByFilter(props.dataSource,
        props.defaultDb, ['deleteTable', 'createTable', 'createIndex', 'updateComment']),
      loading: false,
      editorWidth: '400px',
    };
  }
  componentDidMount(){
    addOnResize(this._getEditorWidth);
    this._getEditorWidth();
  }
  getData = () => {
    return this.state.data;
  };
  getValue = () => {
    let tempValue = [];
    if (this.state.export === 'all') {
      tempValue = ['deleteTable', 'createTable', 'createIndex', 'updateComment'];
    } else {
      tempValue = Object.keys(this.state.type).filter(t => this.state.type[t]);
    }
    return {
      value: tempValue,
      defaultDb: this.state.defaultDb,
    };
  };
  _getEditorWidth = () => {
    if (this.instance) {
      const width = this.instance.offsetWidth;
      this.setState({
        editorWidth: `${width - 400}px`,
      });
    }
  };
  _exportChange = (e) => {
    this.setState({
      export: e,
    });
  };
  _typeChange = (e, type) => {
    this.setState({
      type: {
        ...this.state.type,
        [type]: e.target.value,
      },
    });
  };
  _onDBChange = (e) => {
    this.setState({
      defaultDb: e.target.value,
    });
  };
  _getMode = (value) => {
    let mode = 'mysql';
    if (value.includes('sql')) {
      mode = 'mysql';
    } else if (value.includes('java')) {
      mode = 'java';
    }
    return mode;
  };
  _valueChange = (e) => {
    this.setState({
      data: e.target.value,
    });
  };
  _preview = () => {
    const { dataSource } = this.props;
    const { defaultDb, selectTable } = this.state;
    let tempDataSource = {...dataSource};
    if (selectTable) {
      const tables = selectTable.filter(t => t.includes('/')).map(t => t.split('/')[1]);
      tempDataSource = {
        ...tempDataSource,
        modules: (tempDataSource.modules || []).map((m) => {
          return {
            ...m,
            entities: (m.entities || []).filter(e => tables.includes(e.title)),
          };
        }),
      };
    }
    this.setState({
      data: getAllDataSQLByFilter(tempDataSource,
        defaultDb, this.getValue().value),
    });
  };
  _export = () => {
    // 保存当前导出的数据信息
    const { updateConfig, configJSON } = this.props;
    updateConfig && updateConfig({
      ...(configJSON || {}),
      exportSqlDefault: {
        ...this.state.type,
      },
    }, () => {
      const { exportSQL } = this.props;
      exportSQL && exportSQL();
    });
  };
  _selectTable = () => {
    const { selectTable } = this.state;
    const { dataSource } = this.props;
    openModal(<TreeSelect data={dataSource.modules || []} defaultSelecteds={selectTable}/>, {
      title: '导出数据表选择',
      onOk: (m, c) => {
        this.setState({
          selectTable: c.getKeys() || [],
        });
        m && m.close();
      },
    });
  };
  _getProperties = (obj) => {
    if (typeof obj === 'string') {
      return obj;
    } else if (Array.isArray(obj)) {
      return obj.map(o => `${o[0]}:${o[1]}`).join('\n');
    }
    return Object.keys(obj).map(f => `${f}:${obj[f]}`).join('\n');
  };
  _execSql = () => {
    this.setState({
      loading: true,
    });
    const { dataSource } = this.props;
    const dbData = _object.get(dataSource, 'profile.dbs', []).filter(d => d.defaultDB)[0];
    const dbConfig = _object.omit(dbData.properties, ['driver_class_name']);
    dbConfig.driverClassName = dbData.properties['driver_class_name']; // eslint-disable-line
    const separator = _object.get(dataSource, 'profile.sqlConfig', '/*SQL@Run*/');
    if (dbData) {
      const data = {
        ...dbConfig,
        sql: this.state.data,
        separator,
      };
      Save.sqlexec(data).then((res) => {
        const result = res.data;
        if (result.status === 'SUCCESS') {
          Modal.success({
            title: '执行成功',
            message: <div
              onKeyDown={e => this._onKeyDown(e)}
            >
              <div
                className='pdman-export-sql-success'
              >
                <Input
                  onChange={this._searchValueChange}
                  wrapperStyle={{width: 'auto'}}
                />
                <Icon
                  type='fa-search'
                  style={{marginLeft: 10, cursor: 'pointer'}}
                  onClick={this._search}
                />
                <span
                  ref={instance => this.countDom = instance}
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                >
                      0/0
                </span>
                <Icon style={{ marginLeft: 10, cursor: 'pointer' }} type='arrowdown' onClick={this._selectNext}/>
                <Icon style={{ marginLeft: 10, cursor: 'pointer' }} type='arrowup' onClick={this._selectPre}/>
              </div>
              <Code
                ref={(instance) => {
                  if (instance) {
                    this.code = instance.dom;
                    this.tempHtml = this.code.innerHTML;
                  }
                }}
                style={{height: 400}}
                data={this._getProperties(result.body || result)}
              />
            </div>});
        } else {
          Modal.error({
            title: '执行失败',
            message: <div
              onKeyDown={e => this._onKeyDown(e)}
            >
              <div
                className='pdman-export-sql-error'
              >
                <Input
                  onChange={this._searchValueChange}
                  wrapperStyle={{width: 'auto'}}
                />
                <Icon
                  type='fa-search'
                  style={{marginLeft: 10, cursor: 'pointer'}}
                  onClick={this._search}
                />
                <span
                  ref={instance => this.countDom = instance}
                  style={{ marginLeft: 10, cursor: 'pointer' }}
                >
                      0/0
                </span>
                <Icon style={{ marginLeft: 10, cursor: 'pointer' }} type='arrowdown' onClick={this._selectNext}/>
                <Icon style={{ marginLeft: 10, cursor: 'pointer' }} type='arrowup' onClick={this._selectPre}/>
              </div>
              <Code
                ref={(instance) => {
                  if (instance) {
                    this.code = instance.dom;
                    this.tempHtml = this.code.innerHTML;
                  }
                }}
                style={{height: 400}}
                data={this._getProperties(result.body || result)}
              />
            </div>
            ,
          });
        }
      }).catch((err) => {
        Modal.error({title: '执行失败', message: err.message});
      }).finally(() => {
        this.setState({
          loading: false,
        });
      });
    } else {
      this.setState({
        loading: false,
      });
      Modal.error({title: '执行失败', message: '未配置默认数据库，无法执行SQL，请到数据库版本界面配置默认数据库！'});
    }
  };
  render() {
    const { database } = this.props;
    const { data, defaultDb, selectTable, loading, editorWidth } = this.state;
    return (<div className='pdman-export-sql-content' ref={instance => this.instance = instance}>
      <div
        className='pdman-export-sql-content-header'
        >
        <div
          className='pdman-export-sql-content-header-db'
        >
          <span style={{width: 110, textAlign: 'right'}}>数据库:</span>
          <Select onChange={this._onDBChange} value={this.state.defaultDb} style={{marginLeft: 10}}>
            {
              database.map(db => (<option key={db.code} value={db.code}>{db.code}</option>))
            }
          </Select>
        </div>
        <div
          className='pdman-export-sql-content-header-table'
        >
          <span style={{width: 110, textAlign: 'right'}}>导出数据表:</span>
          <span style={{marginLeft: 10}}>
            {selectTable === null ? '默认导出所有数据表' :
              `当前已选择数据表数量：${selectTable.filter(k => k.includes('/')).length}`}
          </span>
          <Button style={{marginLeft: 10}} title='选择数据表' onClick={this._selectTable}>...</Button>
        </div>
        <div
          className='pdman-export-sql-content-header-button'
         >
          <span style={{width: 110, textAlign: 'right'}}>导出内容:</span>
          <RadioGroup
            groupStyle={{width: 'calc(100% - 110px)'}}
            name='export'
            title='数据表导出内容'
            value={this.state.export}
            onChange={this._exportChange}
          >
            <Radio wrapperStyle={{width: 20, marginLeft: 10}} value='customer'>自定义</Radio>
            <Radio wrapperStyle={{width: 20, marginLeft: 10}} value='all'>全部</Radio>
          </RadioGroup>
        </div>
        <div
          className={`pdman-export-sql-content-header-customer-${this.state.export === 'customer' ? 'show' : 'hidden'}`}
         >
          <span style={{width: 110, textAlign: 'right', minWidth: 110}}>
            自定义导出内容:
          </span>
          <div className='pdman-export-sql-content-header-checkbox'>
            <div className='pdman-export-sql-content-header-checkbox-item'>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'deleteTable')}
                value={this.state.type.deleteTable || false}
              />
              <span>删表语句</span>
            </div>
            <div className='pdman-export-sql-content-header-checkbox-item'>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'createTable')}
                value={this.state.type.createTable || false}
              />
              <span>建表语句</span>
            </div>
            <div className='pdman-export-sql-content-header-checkbox-item'>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'createIndex')}
                value={this.state.type.createIndex || false}
              />
              <span>建索引语句</span>
            </div>
            <div className='pdman-export-sql-content-header-checkbox-item'>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'updateComment')}
                value={this.state.type.updateComment || false}
              />
              <span>表注释语句</span>
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: 'center',
            marginTop: '10px',
          }}
        >
          <Button
            onClick={this._preview}
          >预览</Button>
        </div>
      </div>
      <div style={{border: 'solid 1px #DFDFDF'}}>
        <div style={{margin: '10px 0px'}}>
          <Button type="primary" onClick={this._export}>导出</Button>
          <Button
            style={{marginLeft: 10}}
            onClick={this._execSql}
            loading={loading}
          >
            {loading ? '正在执行' : '执行'}
          </Button>
        </div>
        <Editor
          height='300px'
          width={editorWidth}
          mode={this._getMode(defaultDb)}
          value={data}
          onChange={this._valueChange}
          firstLine
        />
      </div>
    </div>);
  }
}
