import React from 'react';

import _object from 'lodash/object';
import fs from 'fs';

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
import {fileExist, fileExistPromise, readFilePromise, saveFilePromise} from '../utils/json';
import defaultConfig from '../profile';
import { addOnResize } from '../../src/utils/listener';

const { Radio } = RadioGroup;
const { execFile } = require('child_process');

export default class ExportSQL extends React.Component{
  constructor(props){
    super(props);
    this.split = process.platform === 'win32' ? '\\' : '/';
    this.historyPath = `${this.configPath}${this.split}${defaultConfig.userPath}`;
    this.state = {
      selectTable: null,
      export: 'all',
      defaultDb: props.defaultDb,
      type: {
        deleteTable: false,
        createTable: false,
        createIndex: false,
        updateComment: false,
      },
      data: getAllDataSQLByFilter(props.dataSource,
        props.defaultDb, ['deleteTable', 'createTable', 'createIndex', 'updateComment']),
      loading: false,
      editorWidth: '400px',
    };
  }
  componentDidMount(){
    this._getConfigData().then((res) => {
      this.userData = res;
      const exportSqlDefault = this.userData.exportSqlDefault || {};
      this.setState({
        type: {
          deleteTable: exportSqlDefault.deleteTable || false,
          createTable: exportSqlDefault.createTable || false,
          createIndex: exportSqlDefault.createIndex || false,
          updateComment: exportSqlDefault.updateComment || false,
        },
      });
    });
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
    this._saveConfigData({
      ...this.userData,
      exportSqlDefault: {
        ...this.state.type,
      },
    }).then(() => {
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
  _getConfigData = () => {
    return readFilePromise(this.historyPath);
  };
  _saveConfigData = (data) => {
    return saveFilePromise(data, this.historyPath);
  };
  _getProject = (project, type) => {
    const tempItem = project.replace(/\\/g, '/');
    const tempArray = tempItem.split('/');
    if (type === 'name') {
      return tempArray[tempArray.length - 1];
    }
    return tempArray.splice(0, tempArray.length - 1).join(this.split);
  };
  _getJavaConfig = () => {
    const { dataSource } = this.props;
    const dataSourceConfig = _object.get(dataSource, 'profile.javaConfig', {});
    if (!dataSourceConfig.JAVA_HOME) {
      dataSourceConfig.JAVA_HOME = process.env.JAVA_HOME || process.env.JER_HOME || '';
    }
    return dataSourceConfig;
  };
  _getParam = (selectJDBC) => {
    const { dataSource } = this.props;
    const paramArray = [];
    const properties = _object.get(selectJDBC, 'properties', {});
    const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
    Object.keys(properties).forEach((pro) => {
      if (pro !== 'customer_driver') {
        paramArray.push(`${pro}=${properties[pro]}`);
      }
    });
    paramArray.push(`separator=${separator}`);
    return paramArray;
  };
  _parseResult = (stderr, stdout) => {
    const result = (stderr || stdout);
    let tempResult = '';
    try {
      tempResult = JSON.parse(result);
    } catch (e) {
      tempResult = result;
    }
    return tempResult;
  };
  _connectJDBC = (selectJDBC, cb, cmd) => {
    const configData =  this._getJavaConfig();
    const value = configData.JAVA_HOME;
    const defaultPath = '';
    const jar = configData.DB_CONNECTOR || defaultPath;
    const tempValue = value ? `${value}${this.split}bin${this.split}java` : 'java';
    const customerDriver = _object.get(selectJDBC, 'properties.customer_driver', '');
    const commend = [
      '-Dfile.encoding=utf-8',
      '-jar', jar, cmd,
      ...this._getParam(selectJDBC),
    ];
    if (customerDriver) {
      commend.unshift(`-Xbootclasspath/a:${customerDriver}`);
    }
    execFile(tempValue, commend,
      (error, stdout, stderr) => {
        cb && cb(this._parseResult(stderr, stdout));
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
    const { project, dataSource } = this.props;
    const dbData = _object.get(dataSource, 'profile.dbs', []).filter(d => d.defaultDB)[0];
    const proName = this._getProject(project, 'name');
    if (dbData) {
      const name = _object.get(dbData, 'name', 'untitled');
      const fileName = `${proName}-${name}-exec-temp.sql`;
      let tempPath = '';
      fileExistPromise(tempPath, true, this.state.data, '.sql')
        .then(() => {
          if (dbData) {
            this._connectJDBC({
              ...dbData,
              properties: {
                ...(dbData.properties || {}),
                sql: tempPath,
              },
            }, (result) => {
              this.setState({
                loading: false,
              });
              if (result.status === 'SUCCESS') {
                Modal.success({
                  title: '执行成功',
                  message: <div
                    onKeyDown={e => this._onKeyDown(e)}
                  >
                    <div
                      style={{
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
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
                if (fileExist(tempPath)) {
                  fs.unlinkSync(tempPath);
                }
              } else {
                Modal.error({
                  title: '执行失败',
                  message: <div
                    onKeyDown={e => this._onKeyDown(e)}
                  >
                    <div
                      style={{
                        height: '30px',
                        display: 'flex',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                      }}
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
            }, 'sqlexec');
          } else if (fileExist(tempPath)){
            fs.unlinkSync(tempPath);
          }
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
    return (<div style={{display: 'flex'}} ref={instance => this.instance = instance}>
      <div
        style={{
          width: '400px',
          border: 'solid 1px #DFDFDF',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 50,
          marginRight: '5px',
          //justifyContent: 'center',
        }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: 5,
        }}>
          <span style={{width: 110, textAlign: 'right'}}>数据库:</span>
          <Select onChange={this._onDBChange} value={this.state.defaultDb} style={{marginLeft: 10}}>
            {
              database.map(db => (<option key={db.code} value={db.code}>{db.code}</option>))
            }
          </Select>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: 5,
          }}
        >
          <span style={{width: 110, textAlign: 'right'}}>导出数据表:</span>
          <span style={{marginLeft: 10}}>
            {selectTable === null ? '默认导出所有数据表' :
              `当前已选择数据表数量：${selectTable.filter(k => k.includes('/')).length}`}
          </span>
          <Button style={{marginLeft: 10}} title='选择数据表' onClick={this._selectTable}>...</Button>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: 5,
        }}>
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
        <div style={{
          display: this.state.export === 'customer' ? 'flex' : 'none',
          alignItems: 'center',
          padding: 5,
        }}>
          <span style={{width: 110, textAlign: 'right', minWidth: 110}}>
            自定义导出内容:
          </span>
          <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <div style={{display: 'flex'}}>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'deleteTable')}
                value={this.state.type.deleteTable || false}
              />
              <span>删表语句</span>
            </div>
            <div style={{display: 'flex'}}>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'createTable')}
                value={this.state.type.createTable || false}
              />
              <span>建表语句</span>
            </div>
            <div style={{display: 'flex'}}>
              <Checkbox
                wrapperStyle={{width: 20, alignItems: 'center', marginLeft: 10}}
                onChange={e => this._typeChange(e, 'createIndex')}
                value={this.state.type.createIndex || false}
              />
              <span>建索引语句</span>
            </div>
            <div style={{display: 'flex'}}>
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
          {/*<Button
            style={{marginLeft: 10}}
            onClick={this._execSql}
            loading={loading}
          >
            {loading ? '正在执行' : '执行'}
          </Button>*/}
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
