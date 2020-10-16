import React from 'react';
import _object from 'lodash/object';
import moment from 'moment';
import fs from 'fs';

import { fileExist, fileExistPromise, deleteDirectoryFile,
  getDirListPromise, readFilePromise, saveFilePromise, deleteJsonFile } from '../utils/json';
import {Button, openModal, Message, Modal, Input, Select, Icon, RadioGroup, Code, Editor, TextArea} from '../components';
import {getCodeByChanges, getAllDataSQL} from '../utils/json2code';
import { checkVersionData } from '../utils/dbversionutils';
import { compareStringVersion } from '../utils/string';

import './style/dbVersion.less';
import defaultConfig from '../profile';

const { execFile } = require('child_process');

const { Radio } = RadioGroup;

class ChangeCode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      width: '50%',
      again: false,
      synchronous: false,
      preSynchronous: false,
      flagSynchronous: false,
    };
  }
  _onSave = () => {
  };
  _valueChange = (e) => {
    this.data = e.target.value;
  };
  _readDB = () => {
    const { readDB } = this.props;
    readDB && readDB();
  };
  /*_execSQL = (updateDBVersion, type) => {
    const { execSQL, currentVersion, data, checkVersionCount } = this.props;
    let flag = checkVersionCount && checkVersionCount(currentVersion);
    if (!flag) {
      const tempType = type;
      this.setState({
        [tempType]: true,
      });
      execSQL && execSQL(this.data || data, currentVersion, updateDBVersion, () => {
        this.setState({
          [tempType]: false,
        });
      }, type === 'flagSynchronous');
    } else {
      Modal.error({
        title: '同步失败',
        message: '当前操作的版本之前还有版本尚未同步，请不要跨版本操作!',
      });
    }
  };*/
  _iconClick = () => {
    const { width } = this.state;
    this.setState({
      width: width === '50%' ? '100%' : '50%',
    });
  };
  render() {
    const { width, again, synchronous, preSynchronous, flagSynchronous } = this.state;
    const { database = [], messages, data, code,
      currentVersion = {}, dbVersion, init } = this.props;
    const { version } = currentVersion;
    const selectCode = code || database.filter(db => db.defaultDatabase).map(db => db.code)[0];
    return (<div className='pdman-change-code'>
      <Icon
        onClick={this._iconClick}
        className='pdman-change-code-icon'
        type={width === '50%' ? 'verticleright' : 'verticleleft'}
        title={width === '50%' ? '点击收起变化信息' : '点击展开变化信息'}
        style={{left: width === '50%' ? '47%' : 10}}
      />
      <div
        className='pdman-change-code-context'
        style={{width: width === '50%' ? '50%' : '0px', display: width === '50%' ? '' : 'none'}}>
        <span className='pdman-change-code-context-header'>变化信息</span>
        <div>
          {
            messages.length > 0 ?
              messages.map((m, index) => (<div key={m.message}>{`${index + 1}:${m.message}`}</div>)) :
              `${data ? '当前脚本为全量脚本' : '当前版本无变化'}`
          }
        </div>
      </div>
      <div className='pdman-change-code-context' style={{width: width}}>
        <span className='pdman-change-code-context-header'>
          {
            version ? `变化脚本(${compareStringVersion(version, dbVersion) <= 0 ?
              '已同步' : '未同步'})` : '变化脚本'
          }
        </span>
        <div>
          <div
            className='pdman-data-table-content-tab'
          >
            <div
              key={selectCode}
              className='pdman-data-table-content-tab-selected'
            >
              {selectCode}
            </div>
          </div>
          <div className='pdman-data-tab-content'>
            <Button style={{marginBottom: 10}} key="save" onClick={this._onSave}>导出到文件</Button>
            {/*<Button
              loading={preSynchronous}
              title='不会更新数据库中的版本号'
              style={{
                marginLeft: 10,
                display: init === false ? 'none' : '',
              }}
              onClick={() => this._execSQL(false, 'preSynchronous')}
            >
              {preSynchronous ? '正在预同步' : '预同步'}
            </Button>*/}
            {/*<Button
              loading={synchronous}
              title='会更新数据库中的版本号'
              style={{
                marginLeft: 10,
                display: (version && compareStringVersion(version, dbVersion) > 0) ? '' : 'none',
              }}
              onClick={() => this._execSQL(true, 'synchronous')}
            >
              {synchronous ? '正在同步' : '同步'}
            </Button>*/}
            {/*<Button
              loading={flagSynchronous}
              title='更新数据库的版本号，不会执行差异化的SQL'
              style={{
                marginLeft: 10,
                display: (version && compareStringVersion(version, dbVersion) > 0) ? '' : 'none',
              }}
              onClick={() => this._execSQL(true, 'flagSynchronous')}
            >
              {flagSynchronous ? '正在标记为同步' : '标记为同步'}
            </Button>*/}
            {/*<Button
              loading={again}
              title='不会更新数据库中的版本号'
              style={{
                display: version && compareStringVersion(version, dbVersion) <= 0 ? '' : 'none',
                marginLeft: 10,
              }}
              onClick={() => this._execSQL(false, 'again')}
            >
              {again ? '正在执行' : '再次执行'}</Button>*/}
            <Editor
              height='300px'
              width={width === '50%' ?
                `${document.body.clientWidth * 0.3}` : `${document.body.clientWidth * 0.7}`}
              mode='mysql'
              value={this.data || data}
              onChange={this._valueChange}
              firstLine
            />
          </div>
        </div>
      </div>
    </div>);
  }
}

class CustomerVersionCheck extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      changes: [],
      dbVersion: {
        initVersion: props.versions[1] && props.versions[1].version || '',
        incrementVersion: props.versions[0] && props.versions[0].version || '',
      },
      incrementVersionData: { modules: [] },
    };
  }
  _onChange = (e, version) => {
    this.setState({
      dbVersion: {
        ...this.state.dbVersion,
        [version]: e.target.value,
      },
    });
  };
  _onCheck = () => {
    const { dbVersion } = this.state;
    const { versions = [] } = this.props;
    if (!dbVersion.initVersion || !dbVersion.incrementVersion){
      Modal.error({title: '比较失败', message: '请选择你要比较的两个版本'});
    } if (compareStringVersion(dbVersion.incrementVersion, dbVersion.initVersion) <= 0) {
      Modal.error({title: '比较失败', message: '增量脚本的版本号不能小于或等于初始版本的版本号'});
    } else {
      // 读取两个版本下的数据信息
      let incrementVersionData = {};
      let initVersionData = {};
      versions.forEach((v) => {
        if(v.version === dbVersion.initVersion) {
          initVersionData = { modules: v.modules };
        }
        if(v.version === dbVersion.incrementVersion) {
          incrementVersionData = { modules: v.modules };
        }
      });
      const changes = checkVersionData(incrementVersionData, initVersionData);
      this.setState({
        changes,
        incrementVersionData,
      });
    }
  };
  render(){
    const { versions, dbData, constructorMessage, defaultDB, dataSource } = this.props;
    const { changes, dbVersion, incrementVersionData } = this.state;
    const messages = constructorMessage(changes);
    const code = _object.get(dbData, 'type', defaultDB);
    const data = getCodeByChanges({
      ...dataSource,
      ...incrementVersionData,
    }, changes, code);
    return (<div>
      <div style={{display: 'flex'}}>
        <div style={{padding: 5, flexGrow: 1}}>
          <span>初始版本:</span>
          <Select
            style={{
              width: 'calc(100% - 100px)',
              marginLeft: '10px',
            }}
            value={dbVersion.initVersion}
            onChange={e => this._onChange(e, 'initVersion')}
          >
            {
              versions.map(v => (<option key={v.version} value={v.version}>{v.version}</option>))
            }
          </Select>
        </div>
        <div style={{padding: 5, flexGrow: 1}}>
          <span>增量版本:</span>
          <Select
            style={{
              width: 'calc(100% - 100px)',
              marginLeft: '10px',
            }}
            value={dbVersion.incrementVersion}
            onChange={e => this._onChange(e, 'incrementVersion')}
          >
            {
              versions.map(v => (<option key={v.version} value={v.version}>{v.version}</option>))
            }
          </Select>
        </div>
        <Button style={{height: 30}} onClick={this._onCheck}>比较</Button>
      </div>
      <div>
        <ChangeCode
          code={code}
          messages={messages}
          data={data}
          database={_object.get(dataSource, 'dataTypeDomains.database', [])}
        />
      </div>
    </div>);
  }
}

class DatabaseVersionContext extends React.Component{
  onChange = (e, name) => {
    const { defaultVersion } = this.props;
    if (!this.value) {
      this.value = {};
    }
    this.value[name] = e.target.value;
    const { onChange } = this.props;
    onChange && onChange({
      ...this.value,
      version: this.value.version || defaultVersion || this.getNewVersion(),
    });
  };
  getNewVersion = () => {
    const { versions } = this.props;
    if (versions && versions[0] && versions[0].version) {
      const tempArrays = versions[0].version.split('.');
      return tempArrays.map((v, i) => {
        if (i === (tempArrays.length - 1)) {
          return parseInt(v, 10) + 1;
        }
        return v;
      }).join('.');
    }
    return '';
  };
  render() {
    const { versionReadonly, defaultVersion, defaultMessage } = this.props;
    return (<div className='pdman-db-version-context'>
      <div className='pdman-db-version-context-item'>
        <span>版本号：</span>
        <Input
          disabled={versionReadonly}
          style={{width: '100%'}}
          defaultValue={defaultVersion || this.getNewVersion()}
          placeholder='例如：v1.0.0【请勿低于系统默认的数据库版本v0.0.0】'
          onChange={e => this.onChange(e, 'version')}/>
      </div>
      <div className='pdman-db-version-context-item'>
        <span>版本描述：</span>
        <TextArea
          defaultValue={defaultMessage}
          wrapperStyle={{width: '100%'}}
          style={{width: '100%'}}
          placeholder='例如：初始化当前项目版本'
          onChange={e => this.onChange(e, 'message')}/>
      </div>
    </div>);
  }
}

class ReadDB extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      ...props.data,
    };
  }
  _onChange = () => {
    const { onChange } = this.props;
    onChange && onChange(this.state);
  };
  _upgradeTypeChange = (upgradeType) => {
    this.setState({
      upgradeType,
    }, () => {
      this._onChange();
    });
  };
  _readDBTypeChange = (readDBType) => {
    this.setState({
      readDBType,
    }, () => {
      this._onChange();
    });
  };
  _sqlPtahChange = (e) => {
    this.setState({
      sqlPath: e.target.value,
    }, () => {
      this._onChange();
    });
  };
  _selectPath = () => {
  };
  render(){
    return (<div>
      <div style={{display: 'flex', padding: 5}}>
        <span style={{width: 140, textAlign: 'right'}}>数据表升级方式:</span>
        <span>
          <RadioGroup
            name='upgradeType'
            title='数据表升级方式'
            value={this.state.upgradeType}
            onChange={this._upgradeTypeChange}
          >
            <Radio wrapperStyle={{width: 28}} value='rebuild'>
                重建数据表
            </Radio>
            <Radio wrapperStyle={{width: 28}} value='increment'>
                字段增量
            </Radio>
          </RadioGroup>
        </span>
      </div>
      {/*<div style={{display: 'flex', padding: 5}}>
        <span style={{width: 140, textAlign: 'right'}}>写入数据库类型:</span>
        <span>
          <RadioGroup
            name='readDBType'
            title='写入数据库类型'
            value={this.state.readDBType}
            onChange={this._readDBTypeChange}
          >
            <Radio wrapperStyle={{width: 28}} value='readAndSQL'>
                写入数据库并生成SQL文件
            </Radio>
            <Radio wrapperStyle={{width: 28}} value='read'>
                仅写入数据库
            </Radio>
            <Radio wrapperStyle={{width: 28}} value='SQL'>
                仅生成SQL文件
            </Radio>
          </RadioGroup>
        </span>
      </div>
      <div style={{
        display: this.state.readDBType !== 'read' ? 'flex' : 'none',
        padding: 5,
      }}>
        <span style={{width: 140, textAlign: 'right'}}>SQL文件存储路径:</span>
        <span style={{paddingLeft: 8, display: 'flex', width: 'calc(100% - 148px)'}}>
          <Input
            value={this.state.sqlPath}
            style={{width: '100%'}}
            onChange={this._sqlPtahChange}
          />
          <Button onClick={this._selectPath}>...</Button>
        </span>
      </div>*/}
    </div>);
  }
}

export default class DatabaseVersion extends React.Component{
  constructor(props){
    super(props);
    this.split = process.platform === 'win32' ? '\\' : '/';
    this.historyPath = `${this.configPath}${this.split}${defaultConfig.userPath}`;
    this.state = {
      init: true,
      versions: [],
      dbs: _object.get(props.dataSource, 'profile.dbs', []),
      dbVersion: '',
      changes: [],
      configData: {},
      defaultDB: (_object
        .get(props.dataSource, 'dataTypeDomains.database', [])
        .filter(db => db.defaultDatabase)[0] || {}).code,
      synchronous: {},
    };
    moment().local();
  }
  componentDidMount(){
    this._checkBaseVersion();
    this._getVersionMessage();
    this._getDBVersion();
    // 将当前的内容和最新的版本进行比较
    this._saveNewVersion((changes) => {
      this.setState({
        changes,
      });
    });
    this._getConfigData().then((res) => {
      this.setState({
        configData: res,
      });
    });
  }
  _getConfigData = () => {
    return readFilePromise(this.historyPath);
  };
  _saveConfigData = (data) => {
    return saveFilePromise(data, this.historyPath);
  };
  _getVersionMessage = () => {
  };
  _checkBaseVersion = () => {
    const { props } = this;
    // 判断基线版本文件是否存在
    // .project.version/XXX-base.pdman.json
    const name = this._getProject(props.project, 'name');
    const path = this._getProject(props.project, 'path');
    this.basePathDir = `${path}${this.split}.${name}.version${this.split}`;
    this.basePath = `${this.basePathDir}${name}-base.pdman.json`;
    const base = fileExist(this.basePath);
    if (!base) {
      Message.error({title: '当前项目不存在基线版本，请先初始化基线'});
      this.setState({
        init: true,
      });
    } else {
      // 读取版本信息
      this.setState({
        init: false,
      });
    }
  };
  _onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this._search();
    }
  };
  _selectNext = () => {
    if (this.allMatchCount > 0) {
      if (this.count < this.allMatchCount) {
        this.count += 1;
        this.countDom.innerHTML = `${this.count}/${this.allMatchCount}`;
        this.code.scrollTop = this.positions[this.count - 1].top - 200;
        const modalWidth = document.body.clientWidth * 0.8 - 32;
        this.code.scrollLeft = this.positions[this.count - 1].left - modalWidth / 2;
        //console.log(this.code.scrollTop);
        this.spans.forEach((s, index) => {
          if (index === this.count - 1) {
            this.spans[this.count - 1].style.textDecoration = 'underline';
            this.spans[index].style.background = '#FFFFFF';
          } else {
            this.spans[index].style.textDecoration = '';
            this.spans[index].style.background = '';
          }
        });
      }
    }
  };
  _selectPre = () => {
    if (this.allMatchCount > 0) {
      if (this.count > 1) {
        this.count -= 1;
        this.countDom.innerHTML = `${this.count}/${this.allMatchCount}`;
        this.code.scrollTop = this.positions[this.count - 1].top - 200;
        const modalWidth = document.body.clientWidth * 0.8 - 32;
        this.code.scrollLeft = this.positions[this.count - 1].left - modalWidth / 2;
        this.spans.forEach((s, index) => {
          if (index === this.count - 1) {
            this.spans[this.count - 1].style.textDecoration = 'underline';
            this.spans[index].style.background = '#FFFFFF';
          } else {
            this.spans[index].style.textDecoration = '';
            this.spans[index].style.background = '';
          }
        });
      }
    }
  };
  _searchValueChange = (e) => {
    this.searchValue = e.target.value;
  };
  _search = () => {
    this.count = 1;
    this.allMatchCount = [];
    if (this.searchValue) {
      const regExp = new RegExp(this.searchValue, 'g');
      this.allMatchCount = this.tempHtml.match(regExp) && this.tempHtml.match(regExp).length || 0;
      this.countDom.innerHTML = `${this.allMatchCount === 0 ? 0 : 1}/${this.allMatchCount}`;
      this.code.innerHTML = (this.tempHtml || '')
        .replace(regExp, `<span class='pdman-select-value'>${this.searchValue}</span>`);
    } else {
      this.countDom.innerHTML = '0/0';
      this.code.innerHTML = this.tempHtml;
    }
    // 获取top值
    const top = document.body.clientHeight * 0.15 + 76;
    const left = document.body.clientWidth * 0.10 + 16;
    const modalWidth = document.body.clientWidth * 0.8 - 32;
    //console.log(top);
    this.spans = Array.from(this.code.querySelectorAll('.pdman-select-value'));
    this.positions = this.spans
      .map((s) => {
        const rect = s.getBoundingClientRect();
        return {
          top: rect.top - top + this.code.scrollTop,
          left: rect.left - left + this.code.scrollLeft,
        };
      });
    if (this.spans.length > 0) {
      this.spans[0].style.textDecoration = 'underline';
      this.spans[0].style.background = '#FFFFFF';
      this.code.scrollTop = this.positions[0].top - 200;
      this.code.scrollLeft = this.positions[0].left - modalWidth / 2;
    }
    //console.log(this.code.scrollTop);
  };
  _getProject = (project, type) => {
    const tempItem = project.replace(/\\/g, '/');
    const tempArray = tempItem.split('/');
    if (type === 'name') {
      return tempArray[tempArray.length - 1];
    }
    return tempArray.splice(0, tempArray.length - 1).join(this.split);
  };
  _getParam = (selectJDBC) => {
    const paramArray = [];
    const properties = _object.get(selectJDBC, 'properties', {});
    Object.keys(properties).forEach((pro) => {
      if (pro !== 'customer_driver') {
        paramArray.push(`${pro}=${properties[pro]}`);
      }
    });
    return paramArray;
  };
  _connectJDBC = (selectJDBC, cb, cmd) => {
    //const { project } = this.props;
    const configData =  this._getJavaConfig();
    const value = configData.JAVA_HOME;
    const defaultPath = '';
    const jar = configData.DB_CONNECTOR || defaultPath;
    const tempValue = value ? `${value}${this.split}bin${this.split}java` : 'java';
    let modal = null;
    const onOk = () => {
      modal && modal.close();
    };
    if (selectJDBC.showModal) {
      modal = openModal(<Code
        style={{height: 300}}
        data={`执行同步命令：${tempValue} -Dfile.encoding=utf-8 -jar ${jar} ${cmd} ${this._getParam(selectJDBC).join(' ')}`}
      />, {
        title: '开始同步，同步结束后当前窗口将会自动关闭！',
        footer: [<Button style={{marginTop: 10}} key="ok" onClick={onOk} type="primary">关闭</Button>],
      });
    }
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
        modal && modal.close();
        const result = this._parseResult(stderr, stdout);
        cb && cb(result);
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
  _getCMD = (updateVersion, onlyUpdateVersion) => {
    // 一共有三种情况
    // 1.预同步 执行SQL但是不更新版本号
    // 2.同步 执行SQL同时更新版本号
    // 3.标记为同步 只更新版本号
    let cmd = 'dbsync';
    if (onlyUpdateVersion) {
      cmd = 'updateVersion';
    } else if (updateVersion) {
      cmd = 'dbsync';
    } else {
      cmd = 'sqlexec';
    }
    return cmd;
  };
  _generateSQL = (dbData, version, data, updateVersion, path, cb, onlyUpdateVersion) => {
    // 判断是否是标记为同步还是同步
    const cmd = this._getCMD(updateVersion, onlyUpdateVersion);
    // 获取外层目录
    const { project, dataSource } = this.props;
    // 构建文件名
    const proName = this._getProject(project, 'name');
    const name = _object.get(dbData, 'name', 'untitled');
    const fileName = `${proName}-${name}-${version.version}.sql`;
    // 构建最终文件名【项目名-数据库名-版本号】
    let tempPath = '';
    fileExistPromise(tempPath, true, data, '.sql')
      .then(() => {
        if (path) {
          // Message.success({title: `SQL文件生成成功！[${tempPath}]`});
        }
        if (dbData) {
          const sqlParam = {};
          if (updateVersion) {
            sqlParam.version_desc = version.message;
            sqlParam.version = version.version;
          }
          if (!onlyUpdateVersion) {
            const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
            sqlParam.sql = tempPath;
            sqlParam.separator = separator;
          }
          this._connectJDBC({
            ...dbData,
            properties: {
              ...(dbData.properties || {}),
              ...sqlParam,
            },
            showModal: true,
          }, (result) => {
            cb && cb();
            this.setState({
              synchronous: {
                ...this.state.synchronous,
                [version.version]: false,
              },
            });
            if (result.status === 'SUCCESS') {
              Modal.success({
                title: '数据库同步成功',
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
                    data={cmd === 'updateVersion' ? '标记成功！' : this._getProperties(result.body || result)}
                  />
                </div>});
              if (fileExist(tempPath)) {
                !path && fs.unlinkSync(tempPath);
                // console.log(`${temp}${this.split}pdman-${version}.sql`);
                // 同步成功后再一次检查数据库版本
                updateVersion && this._getDBVersion();
              }
            } else {
              Modal.error({
                title: '数据库同步失败',
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
                    data={cmd === 'updateVersion' ? '标记失败！' : this._getProperties(result.body || result)}
                  />
                </div>
                ,
              });
            }
          }, cmd);
        } else if (fileExist(tempPath)){
          !path && fs.unlinkSync(tempPath);
        }
      });
  };
  // 校验需要同步的版本是否存在跨版本同步的问题
  _checkVersionCount = (version) => {
    const { dbVersion, versions } = this.state;
    // 1.获取所有当前比数据库版本高的版本
    let lowVersions = [];
    if (!dbVersion) {
      lowVersions = versions;
    } else {
      lowVersions = versions.filter(v => compareStringVersion(v.version, dbVersion) > 0);
    }
    return lowVersions
      .filter(v => v.version !== version.version)
      .some(v => compareStringVersion(v.version, version.version) <= 0);
  };
  _execSQL = (data, version, updateDBVersion, cb, onlyUpdateDBVersion) => {
    const dbData = this._getCurrentDBData();
    if (!dbData) {
      /*this.setState({
        dbVersion: '',
      });
      Modal.error({
        title: '初始化数据库版本表失败',
        message: '无法获取到数据库信息，请切换尝试数据库'});*/
      cb && cb();
    } else {
      this._generateSQL(dbData, version, data, updateDBVersion, null, cb, onlyUpdateDBVersion);
    }
  };
  _readDb = (status, version, lastVersion, changes = [], initVersion, updateVersion) => {
    if (!status) {
      const dbData = this._getCurrentDBData();
      if (!dbData) {
       /* Modal.error({
          title: '同步失败',
          message: '无法获取到数据库信息，' +
            '请切换尝试数据库'});*/
      } else {
        let flag = false;
        if (!initVersion) {
          flag = this._checkVersionCount(version);
        }
        if (flag) {
          Modal.error({
            title: '同步失败',
            message: '当前操作的版本之前还有版本尚未同步，请不要跨版本操作!',
          });
        } else {
          Modal.confirm({
            title: '同步确认',
            message: '数据即将同步到数据库，同步后不可撤销，确定同步吗？',
            onOk: (m) => {
              this.setState({
                synchronous: {
                  ...this.state.synchronous,
                  [version.version]: true,
                },
              });
              m && m.close();
              const { configData } = this.state;
              let tempValue = {
                upgradeType: 'rebuild',
                readDBType: 'read',
                sqlPath: '',
                ..._object.omit(configData.synchronous || {}, ['readDBType', 'sqlPath']),
              };
              if (tempValue.readDBType !== 'read' && !tempValue.sqlPath) {
                Modal.error({
                  title: '同步失败',
                  message: '未配置SQL文件路径，请在同步设置中设置文件路径'});
                this.setState({
                  synchronous: {
                    ...this.state.synchronous,
                    [version.version]: false,
                  },
                });
              } else {
                let data = '';
                // 判断是否为初始版本，如果为初始版本则需要生成全量脚本
                if (initVersion) {
                  data = getAllDataSQL({
                    ...this.props.dataSource,
                    modules: version.modules,
                  }, _object.get(dbData, 'type', this.state.defaultDB));
                } else {
                  let tempChanges = [...changes];
                  if (tempValue.upgradeType === 'rebuild') {
                    // 如果是重建数据表则不需要字段更新的脚本
                    // 1.提取所有字段以及索引所在的数据表
                    let entities = [];
                    // 2.暂存新增和删除的数据表
                    const tempEntitiesUpdate = [];
                    tempChanges.forEach((c) => {
                      if (c.type === 'entity') {
                        tempEntitiesUpdate.push(c);
                      } else {
                        entities.push(c.name.split('.')[0]);
                      }
                    });
                    tempChanges = [...new Set(entities)].map((e) => {
                      // 构造版本变化数据
                      return {
                        type: 'entity',
                        name: e,
                        opt: 'update',
                      };
                    }).concat(tempEntitiesUpdate);
                  } else {
                    // todo 暂时取消数据表的中文名以及其他变化时所生成的更新数据
                    tempChanges = tempChanges.filter(c => !(c.type === 'entity' && c.opt === 'update'));
                  }
                  data = getCodeByChanges({
                      ...this.props.dataSource,
                      modules: version.modules,
                    }, tempChanges,
                    _object.get(dbData, 'type', this.state.defaultDB),
                    { modules: (lastVersion && lastVersion.modules) || [] });
                }
                this._generateSQL(dbData, version, data, updateVersion, tempValue.readDBType !== 'read' && tempValue.sqlPath);
              }
            }});
        }
      }
    }
  };
  _initBase = (message, cb) => {
    let tempValue = {};
    const onChange = (value) => {
      tempValue = value;
    };
    openModal(<DatabaseVersionContext versions={this.state.versions} onChange={onChange}/>, {
      title: '版本信息',
      onOk: (modal) => {
        if (!tempValue.version || !tempValue.message) {
          Modal.error({title: '操作失败', message: '版本号和版本描述不能为空', width: 200});
        } else {
          cb && cb();
          const { dataSource } = this.props;
          // 基线文件只需要存储modules信息
          fileExistPromise(this.basePath, true, {
            modules: dataSource.modules || [],
            ...tempValue,
            date: moment().format('YYYY/M/D H:m:s'),
          }).then(() => {
            Message.success({title: message || '初始化基线成功'});
            modal && modal.close();
            this._getVersionMessage();
            // 更新版本表
            this._dropVersionTable(tempValue);
            this._saveNewVersion((changes) => {
              this.setState({
                changes,
                init: false,
              });
            });
          });
        }
      },
    });
  };
  _dropVersionTable = () => {
    const dbData = this._getCurrentDBData();
    if (!dbData) {
      /*this.setState({
        dbVersion: '',
      });
      Modal.error({
        title: '初始化数据库版本表失败',
        message: '无法获取到数据库信息，请切换尝试数据库'});*/
    } else {
     /* this._connectJDBC({
        ...dbData,
        properties: {
          ...(dbData.properties || {}),
          version: 'v0.0.0',
          version_desc: '默认版本，新增的版本不能低于此版本',
        },
      }, (result) => {
        if (result.status !== 'SUCCESS') {
          Message.error({title: '初始化数据表失败'});
        } else {
          Message.success({title: '初始化数据表成功'});
          this._getDBVersion();
        }
      }, 'rebaseline');*/
    }
  };
  _rebuild = () => {
    Modal.confirm({
      title: '重建基线',
      message: '重建基线将会清除当前项目的所有版本信息，该操作不可逆，是否继续？',
      onOk: (modal) => {
        modal.close();
        // 重新初始化
        this._initBase('重建基线成功', () => {
          // 删除目录
          deleteDirectoryFile(this.basePathDir);
        });
      }});
  };
  _getAllTable = (dataSource) => {
    return (dataSource.modules || []).reduce((a, b) => {
      return a.concat((b.entities || []));
    }, []);
  };
  _compareField = (currentField, checkField, table) => {
    const changes = [];
    Object.keys(currentField).forEach((name) => {
      if (checkField[name] !== currentField[name]) {
        changes.push({
          type: 'field',
          name: `${table.title}.${currentField.name}.${name}`,
          opt: 'update',
          changeData: `${checkField[name]}=>${currentField[name]}`,
        });
      }
    });
    return changes;
  };
  _compareIndex = (currentIndex, checkIndex, table) => {
    const changes = [];
    Object.keys(currentIndex).forEach((name) => {
      if (checkIndex[name] !== currentIndex[name]) {
        changes.push({
          type: 'index',
          name: `${table.title}.${currentIndex.name}.${name}`,
          opt: 'update',
          changeData: `${checkIndex[name]}=>${currentIndex[name]}`,
        });
      }
    });
    return changes;
  };
  _compareStringArray = (currentFields, checkFields, title, name) => {
    const changes = [];
    currentFields.forEach((f) => {
      if (!checkFields.includes(f)) {
        changes.push({
          type: 'index',
          name: `${title}.${name}.fields.${f}`,
          opt: 'update',
          changeData: `addField=>${f}`,
        });
      }
    });
    checkFields.forEach((f) => {
      if (!currentFields.includes(f)) {
        changes.push({
          type: 'index',
          name: `${title}.${name}.fields.${f}`,
          opt: 'update',
          changeData: `deleteField=>${f}`,
        });
      }
    });
    return changes;
  };
  _compareIndexs = (currentTable, checkTable) => {
    const changes = [];
    const currentIndexs = currentTable.indexs || [];
    const checkIndexs = checkTable.indexs || [];
    const checkIndexNames = checkIndexs.map(index => index.name);
    const currentIndexNames = currentIndexs.map(index => index.name);
    currentIndexs.forEach((cIndex) => {
      if (!checkIndexNames.includes(cIndex.name)) {
        changes.push({
          type: 'index',
          name: `${currentTable.title}.${cIndex.name}`,
          opt: 'add',
        });
      } else {
        const checkIndex = checkIndexs.filter(c => c.name === cIndex.name)[0] || {};
        changes.push(...this._compareIndex(_object.omit(cIndex, ['fields']),
          _object.omit(checkIndex, ['fields']), currentTable));
        // 比较索引中的属性
        const checkFields = checkIndex.fields || [];
        const currentFields = cIndex.fields || [];
        changes.push(...this._compareStringArray(
          currentFields, checkFields, currentTable.title, cIndex.name));
      }
    });
    checkIndexs.forEach((cIndex) => {
      if (!currentIndexNames.includes(cIndex.name)) {
        changes.push({
          type: 'index',
          name: `${currentTable.title}.${cIndex.name}`,
          opt: 'delete',
        });
      }
    });
    return changes;
  };
  _compareEntity = (currentTable, checkTable) => {
    const changes = [];
    Object.keys(currentTable).forEach((name) => {
      if (checkTable[name] !== currentTable[name]) {
        changes.push({
          type: 'entity',
          name: `${currentTable.title}.${name}`,
          opt: 'update',
          changeData: `${checkTable[name]}=>${currentTable[name]}`,
        });
      }
    });
    return changes;
  };
  _saveNewVersion = (cb) => {
    // 保存当前版本信息
    // 1.计算当前版本变化
    // 1.1. 读取版本控制目录下的所有文件找出版本号最大的一个版本文件进行比较（如果没有其他的版本文件，则直接与基线版本进行对比）
    getDirListPromise(this.basePathDir).then((res) => {
      const versions = res.filter(r => r.endsWith('.pdman.json')).map((r) => {
        const names = r.split('-');
        const file = names[names.length - 1];
        if (file) {
          const v = file.split('.pdman.json')[0];
          if (v && v !== 'base') {
            return v;
          }
          return null;
        }
        return null;
      }).filter(v => !!v);
      let checkVersion = 'base';
      if (versions.length > 0) {
        checkVersion = versions.sort((a, b) => compareStringVersion(b, a))[0];
      }
      const { dataSource, project } = this.props;
      // 读取当前版本的内容
      const currentDataSource = {...dataSource};
      // 组装需要比较的版本内容
      const name = this._getProject(project, 'name');
      const checkPath = `${this.basePathDir}${name}-${checkVersion}.pdman.json`;
      readFilePromise(checkPath).then((checkDataSource) => {
        // 循环比较每个模块下的每张表以及每一个字段的差异
        const changes = [];
        // 1.获取所有的表
        const currentTables = this._getAllTable(currentDataSource);
        const checkTables = this._getAllTable(checkDataSource);
        const checkTableNames = checkTables.map(e => e.title);
        const currentTableNames = currentTables.map(e => e.title);
        // 2.将当前的表循环
        currentTables.forEach((table) => {
          // 1.1 判断该表是否存在
          if (checkTableNames.includes(table.title)) {
            // 1.2.1 如果该表存在则需要对比字段
            const checkTable = checkTables.filter(t => t.title === table.title)[0] || {};
            // 将两个表的所有的属性循环比较
            const checkFields = (checkTable.fields || []).filter(f => f.name);
            const tableFields = (table.fields || []).filter(f => f.name);
            const checkFieldsName = checkFields.map(f => f.name);
            const tableFieldsName = tableFields.map(f => f.name);
            tableFields.forEach((field) => {
              if (!checkFieldsName.includes(field.name)) {
                changes.push({
                  type: 'field',
                  name: `${table.title}.${field.name}`,
                  opt: 'add',
                });
              } else {
                // 比较属性的详细信息
                const checkField = checkFields.filter(f => f.name === field.name)[0] || {};
                const result = this._compareField(field, checkField, table);
                changes.push(...result);
              }
            });
            checkFields.forEach((field) => {
              if (!tableFieldsName.includes(field.name)) {
                changes.push({
                  type: 'field',
                  name: `${table.title}.${field.name}`,
                  opt: 'delete',
                });
              }
            });
            // 1.2.2 其他信息
            const entityResult = this._compareEntity(_object.omit(table, ['fields', 'indexs', 'headers']),
              _object.omit(checkTable, ['fields', 'indexs']));
            changes.push(...entityResult);
            // 1.2.3 对比索引
            const result = this._compareIndexs(table, checkTable);
            changes.push(...result);
          } else {
            // 1.3 如果该表不存在则说明当前版本新增了该表
            changes.push({
              type: 'entity',
              name: table.title,
              opt: 'add',
            });
          }
        });
        // 3.将比较的表循环，查找删除的表
        checkTables.forEach((table) => {
          // 1.1 判断该表是否存在
          if (!currentTableNames.includes(table.title)) {
            // 1.2 如果该表不存在则说明当前版本删除了该表
            changes.push({
              type: 'entity',
              name: table.title,
              opt: 'delete',
            });
          }
        });
        if (cb) {
          cb && cb(changes);
        } else {
          let tempValue = {};
          const onChange = (value) => {
            tempValue = value;
          };
          openModal(<DatabaseVersionContext versions={this.state.versions} onChange={onChange}/>, {
            title: '版本信息',
            onOk: (modal) => {
              if (!tempValue.version || !tempValue.message) {
                Modal.error({title: '操作失败', message: '版本号和版本描述不能为空', width: 200});
              } else if (this.state.versions.map(v => v.version).includes(tempValue.version)) {
                Modal.error({title: '操作失败', message: '该版本号已经存在了', width: 200});
              } else if (this.state.versions[0] &&
                compareStringVersion(tempValue.version, this.state.versions[0].version) <= 0) {
                Modal.error({title: '操作失败', message: '新版本不能小于或等于已经存在的版本'});
              } else {
                const newVersionPath = `${this.basePathDir}${name}-${tempValue.version}.pdman.json`;
                fileExistPromise(newVersionPath, true, {
                  modules: dataSource.modules || [],
                  ...tempValue,
                  changes,
                  date: moment().format('YYYY/M/D H:m:s'),
                }).then(() => {
                  modal && modal.close();
                  this._getVersionMessage();
                  this.setState({
                    changes: [],
                  });
                  Message.success({title: '当前版本保存成功'});
                });
              }
            },
          });
        }
      });
    }).catch(() => {});
  };
  _getOptName = (opt) => {
    let optName = '';
    switch (opt) {
      case 'update': optName = '更新';break;
      case 'add': optName = '新增';break;
      case 'delete': optName = '删除';break;
      default: optName = '未知操作';break;
    }
    return optName;
  };
  _getTypeName = (type) => {
    let optName = '';
    switch (type) {
      case 'entity': optName = '表';break;
      case 'index': optName = '索引';break;
      case 'field': optName = '属性';break;
      default: optName = '未知类型';break;
    }
    return optName;
  };
  _constructorMessage = (changes) => {
    /*"type": "entity",
      "name": "CUST_BASE/chnname",
      "opt": "update"*/
    return changes.map((c) => {
      let tempMsg = `${this._getOptName(c.opt)}
      ${this._getTypeName(c.type)}【${c.name}】`;
      if (c.changeData) {
        tempMsg = `${tempMsg}【${c.changeData}】`;
      }
      return {
        ...c,
        message: tempMsg,
      };
    });
  };
  _showChanges = (changes = [], initVersion, currentVersion, lastVersion, dbVersion) => {
    const { init, configData } = this.state;
    const { dataSource } = this.props;
    let tempChanges = [...changes];
    let tempValue = {
      upgradeType: 'rebuild',
      ...(configData.synchronous || {}),
    };
    if (tempValue.upgradeType === 'rebuild') {
      // 如果是重建数据表则不需要字段更新的脚本
      // 1.提取所有字段以及索引所在的数据表
      let entities = [];
      // 2.暂存新增和删除的数据表
      const tempEntitiesUpdate = [];
      tempChanges.forEach((c) => {
        if (c.type === 'entity') {
          tempEntitiesUpdate.push(c);
        } else {
          entities.push(c.name.split('.')[0]);
        }
      });
      tempChanges = [...new Set(entities)].map((e) => {
        // 构造版本变化数据
        return {
          type: 'entity',
          name: e,
          opt: 'update',
        };
      }).concat(tempEntitiesUpdate);
    } else {
      // todo 暂时取消数据表的中文名以及其他变化时所生成的更新数据
      tempChanges = tempChanges.filter(c => !(c.type === 'entity' && c.opt === 'update'));
    }
    const messages = this._constructorMessage(changes);
    const dbData = this._getCurrentDBData();
    const code = _object.get(dbData, 'type', this.state.defaultDB);
    let data = '';
    if (init) {
      data = getAllDataSQL({
        ...dataSource,
        modules: dataSource.modules || [],
      }, code);
    } else {
      data = initVersion ?
        getAllDataSQL({
          ...dataSource,
          modules: currentVersion.modules,
        }, code) :
        getCodeByChanges({
          ...dataSource,
          modules: currentVersion.modules,
        }, tempChanges, code, {
          modules: (lastVersion && lastVersion.modules) || [],
        });
    }

    let modal = null;
    const onOk = () => {
      modal && modal.close();
    };
    modal = openModal(<ChangeCode
      readDB={() => this._readDb(false, currentVersion, lastVersion, changes, initVersion, false)}
      currentVersion={currentVersion}
      dbVersion={dbVersion}
      code={code}
      messages={messages}
      data={data}
      database={_object.get(dataSource, 'dataTypeDomains.database', [])}
      execSQL={this._execSQL}
      init={init}
      checkVersionCount={this._checkVersionCount}
    />, {
      autoFocus: true,
      title: '版本变更记录详情',
      footer: [
        <Button style={{marginTop: 10}} key="ok" onClick={onOk} type="primary">关闭</Button>,
      ],
    });
  };
  _getJavaConfig = () => {
    const { dataSource } = this.props;
    const dataSourceConfig = _object.get(dataSource, 'profile.javaConfig', {});
    if (!dataSourceConfig.JAVA_HOME) {
      dataSourceConfig.JAVA_HOME = process.env.JAVA_HOME || process.env.JER_HOME || '';
    }
    return dataSourceConfig;
  };
  _parseResult = (stderr, stdout) => {
    const result = (stdout || stderr);
    let tempResult = '';
    try {
      tempResult = JSON.parse(result);
    } catch (e) {
      tempResult = result;
    }
    return tempResult;
  };
  _getDBVersion = () => {
    /*// 模拟返回1.0.1
    this.setState({
      versionData: true,
    });
    const dbData = this._getCurrentDBData();
    if (!dbData) {
      this.setState({
        dbVersion: '',
      });
      Message.error({
        title: '获取数据库信息失败,无法获取到数据库信息,请切换尝试数据库！',
        });
      this.setState({
        versionData: false,
      });
    } else {
      this._connectJDBC({
        ...dbData,
        properties: {
          ...(dbData.properties || {}),
        },
      }, (result) => {
        if (result.status !== 'SUCCESS') {
          Message.error({title: '数据库链接失败', message: result.body || result});
        } else {
          Message.success({title: '数据库链接成功'});
        }
        this.setState({
          versionData: false,
          dbVersion: result.status !== 'SUCCESS' ? '' : result.body,
        });
      }, 'dbversion');
    }*/
  };
  _getCurrentDBData = () => {
    const { dbs } = this.state;
    return dbs.filter(d => d.defaultDB)[0];
  };
  _getCurrentDB = () => {
    const { dbs } = this.state;
    const db = dbs.filter(d => d.defaultDB)[0];
    if (db) {
      return db.name;
    }
    return '';
  };
  _dbChange = (e) => {
    const { dbs } = this.state;
    this.setState({
      dbs: (dbs || []).map((db) => {
        if (db.name === e.target.value) {
          return {
            ...db,
            defaultDB: true,
          };
        }
        return {
          ...db,
          defaultDB: false,
        };
      }),
    }, () => {
      this._getDBVersion();
    });
  };
  _synchronousConfig = () => {
    const { configData } = this.state;
    let tempValue = {
      upgradeType: 'rebuild',
      readDBType: 'read',
      sqlPath: '',
      ...(configData.synchronous || {}),
    };
    const onChange = (value) => {
      tempValue = value;
    };
    openModal(<ReadDB onChange={onChange} data={tempValue}/>, {
      title: '同步配置（配置成功后，后续的同步的操作都使用该配置）',
      onOk: (modal) => {
        // 更新用户配置信息
        this.setState({
          configData: {
            ...this.state.configData,
            synchronous: {
              ...tempValue,
            },
          },
        });
        // 保存到用户配置文件下
        this._saveConfigData({
          ...configData,
          synchronous: {
            ...tempValue,
          },
        });
        Message.success({title: '配置成功！'});
        modal && modal.close();
      },
    });
  };
  _customerVersionCheck = () => {
    // 自定义版本比较
    const { versions } = this.state;
    const { dataSource } = this.props;
    let modal = null;
    const onOk = () => {
      modal && modal.close();
    };
    modal = openModal(<CustomerVersionCheck
      versions={versions}
      dataSource={dataSource}
      dbData={this._getCurrentDBData()}
      constructorMessage={this._constructorMessage}
      defaultDB={this.state.defaultDB}
  />, {
      title: '请选择两个版本',
      footer: [
        <Button style={{marginTop: 10}} key="ok" onClick={onOk} type="primary">关闭</Button>,
      ],
    });
  };
  _editVersion = (index, version) => {
    // 如果是第一个则可以修改版本号
    let tempValue = version;
    const onChange = (value) => {
      tempValue = {
        ...tempValue,
        ...value,
        date: moment().format('YYYY/M/D H:m:s'),
      };
    };
    openModal(<DatabaseVersionContext
      versions={this.state.versions}
      onChange={onChange}
      versionReadonly={index !== 0}
      defaultVersion={version.version}
      defaultMessage={version.message}
    />, {
      title: '修改版本信息',
      onOk: (modal) => {
        const tempVersions = this.state.versions.slice(1);
        if (!tempValue.version || !tempValue.message) {
          Modal.error({title: '操作失败', message: '版本号和版本描述不能为空', width: 200});
        } else if (index !== 0){
          this._updateVersionFile(tempValue, version, 'update', () => {
            this.setState({
              versions: this.state.versions.map((v, vIndex) => {
                if (vIndex === index) {
                  return tempValue;
                }
                return v;
              }),
            });
            modal && modal.close();
          });
        } else if (tempVersions.map(v => v.version).includes(tempValue.version)) {
          Modal.error({title: '操作失败', message: '该版本号已经存在了', width: 200});
        } else if (tempVersions[0] &&
          compareStringVersion(tempValue.version, this.state.versions[0].version) <= 0) {
          Modal.error({title: '操作失败', message: '新版本不能小于或等于已经存在的版本'});
        } else {
          this._updateVersionFile(tempValue, version, 'update', () => {
            modal && modal.close();
            this.setState({
              versions: this.state.versions.map((v, vIndex) => {
                if (vIndex === index) {
                  return tempValue;
                }
                return v;
              }),
            });
          });
        }
      },
    });
  };
  _deleteVersion = (version) => {
    Modal.confirm({
      title: '删除确定',
      message: '删除后不可撤销',
      onOk: (m) => {
        const tempVersion = version;
        this.setState({
          versions: this.state.versions.filter(v => v.version !== version.version),
        }, () => {
          this._updateVersionFile(tempVersion, tempVersion, 'delete');
          m && m.close();
        });
      }});
  };
  _updateVersionFile = (newVersion, oldVersion, status, cb) => {
    const { project } = this.props;
    const name = this._getProject(project, 'name');
    let newVersionPath = `${this.basePathDir}${name}-${newVersion.version}.pdman.json`;
    let oldVersionPath = `${this.basePathDir}${name}-${oldVersion.version}.pdman.json`;
    if (newVersion.file.endsWith('-base.pdman.json')) {
      newVersionPath = `${this.basePathDir}${name}-base.pdman.json`;
      oldVersionPath = `${this.basePathDir}${name}-base.pdman.json`;
    }
    if (status === 'update') {
      if (newVersionPath !== oldVersionPath) {
        // 删除原来的
        deleteJsonFile(oldVersionPath);
      }
      // 创建新增的
      fileExistPromise(newVersionPath, true, _object.omit(newVersion, ['file'])).then(() => {
        Message.success({title: '版本信息更新成功'});
        this._saveNewVersion((changes) => {
          this.setState({
            changes,
          }, () => {
            this._checkBaseVersion();
            cb && cb();
          });
        });
      }).catch(() => {
        Message.success({title: '版本信息更新失败'});
        this._saveNewVersion((changes) => {
          this.setState({
            changes,
          }, () => {
            this._checkBaseVersion();
            cb && cb();
          });
        });
      });
    } else {
      // 删除原来的
      deleteJsonFile(oldVersionPath);
      Message.success({title: '版本信息删除成功'});
      if (!newVersion.file.endsWith('-base.pdman.json')) {
        this._saveNewVersion((changes) => {
          this.setState({
            changes,
          });
        });
      } else {
        this.setState({
          changes: [],
        });
      }
      this._checkBaseVersion();
      cb && cb();
    }
  };
  render(){
    const { init, versionData, versions, dbVersion, changes, dbs, synchronous } = this.state;
    const currentDB = this._getCurrentDB();
    return (<div className='pdman-db-version'>
      <div className='pdman-db-version-opt-container'>
        <div className='pdman-db-version-opt'>
          <div
            className='pdman-db-version-opt-synchronous pdman-db-version-opt-wrapper'
            onClick={this._synchronousConfig}
          >
            <span className='pdman-db-version-opt-synchronous-icon'>{}</span>
            <span className='pdman-db-version-opt-synchronous-name'>同步配置</span>
          </div>
          <div
            className='pdman-db-version-opt-init  pdman-db-version-opt-wrapper'
            style={{display: init ? '' : 'none'}}
            onClick={() => this._initBase()}
          >
            <span className='pdman-db-version-opt-init-icon'>{}</span>
            <span className='pdman-db-version-opt-init-name'>初始化基线</span>
          </div>
          <div
            className='pdman-db-version-opt-save  pdman-db-version-opt-wrapper'
            style={{display: init ? 'none' : ''}}
            onClick={() => this._saveNewVersion()}
          >
            <span className='pdman-db-version-opt-save-icon'>{}</span>
            <span className='pdman-db-version-opt-save-name'>保存新版本</span>
          </div>
          <div
            className='pdman-db-version-opt-rebuild  pdman-db-version-opt-wrapper'
            style={{display: init ? 'none' : ''}}
            onClick={this._rebuild}
          >
            <span className='pdman-db-version-opt-rebuild-icon'>{}</span>
            <span className='pdman-db-version-opt-rebuild-name'>重建基线</span>
          </div>
          <div
            className='pdman-db-version-opt-compare  pdman-db-version-opt-wrapper'
            onClick={this._customerVersionCheck}
          >
            <span className='pdman-db-version-opt-compare-icon'>{}</span>
            <span className='pdman-db-version-opt-compare-name'>任意版本比较</span>
          </div>
        </div>
        {/*<div className='pdman-db-version-opt'>
          <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          切换数据库：
            <Select value={currentDB} style={{minWidth: 200}} onChange={this._dbChange}>
              <option key='' value=''>-请选择-</option>
              {
                dbs.map(db => (<option key={db.name} value={db.name}>{db.name}</option>))
              }
            </Select>
          </span>
        </div>*/}
      </div>
      {
        versionData ? <div
          style={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >正在获取版本信息...</div> : (
          <div className='pdman-db-version-list'>
            <span
              style={{textAlign: 'center', color: '#2492E6'}}
            >
              当前版本暂时关闭数据库连接功能，大家可以手动复制SQL语句手动执行
              {/*{currentDB ? `当前使用的数据库：【${currentDB}】,
              当前数据库版本：【${dbVersion === 'v0.0.0' ?
                `数据库默认初始版本:${dbVersion}` : dbVersion ||
                '当前数据库版本暂未生成，请先初始化基线或者同步当前版本！'}】`
                : '当前未选择数据库，如需同步到数据库请先配置数据库!'}*/}
            </span>
            <div style={{display: 'flex', justifyContent: 'center',  flexGrow: 1, minHeight: 65}}>
              <div className='pdman-db-version-list-item'>
                <div className='pdman-db-version-list-item-time'>
                  {}
                </div>
                <div className='pdman-db-version-list-item-line'>
                  <div>{}</div>
                  <span
                    className={`pdman-db-version-list-item-line-${changes.length > 0 ? 'current-changes' : 'current-unchange'}`}
                  >
                    {}
                  </span>
                </div>
                <div className='pdman-db-version-list-item-tag'>
                  <span
                    className='pdman-db-version-list-item-tag-message'
                    onClick={() => this._showChanges(changes, false,
                      this.props.dataSource, versions[0] || this.props.dataSource)}
                  >
                    {
                      changes.length > 0 ? '当前内容与上一版本的内容有变化，但未保存版本！' : '当前内容与上一版本内容无变化'
                    }
                  </span>
                </div>
              </div>
            </div>
            {
              versions.map((v, index) => (
                <div key={v.version} style={{display: 'flex', justifyContent: 'center',  flexGrow: 1, minHeight: 50}}>
                  <div className='pdman-db-version-list-item'>
                    <div className='pdman-db-version-list-item-time'>
                      <span className='pdman-db-version-list-item-time-all'>
                        <span
                          className='pdman-db-version-list-item-time-day'
                        >{v.date.split(' ')[0]}
                        </span>
                        <span
                          className='pdman-db-version-list-item-time-min'
                        >{v.date.split(' ')[1]}
                        </span>
                      </span>
                    </div>
                    <div className='pdman-db-version-list-item-line'>
                      <div>{}</div>
                      <span
                        className={`pdman-db-version-list-item-line-${compareStringVersion(v.version, dbVersion) <= 0 ?
                          'success' : 'error'}`}
                      >
                        { compareStringVersion(v.version, dbVersion) <= 0 ? <Icon type='check'/> : <Icon type='minus'/> }
                      </span>
                    </div>
                    <div className='pdman-db-version-list-item-tag'>
                      <div className='pdman-db-version-list-item-tag-arrow'>{}
                      </div>
                      <div
                        /*onClick={() => this._readDb(
                          compareStringVersion(v.version, dbVersion) <= 0,
                          v,
                          versions[index + 1] || v, v.changes,
                          index === (versions.length - 1), true)}
                        title={compareStringVersion(v.version, dbVersion) <= 0 ? '' : '点击将进行同步'}*/
                        className={`pdman-db-version-list-item-tag-${compareStringVersion(v.version, dbVersion) <= 0 ?
                          'success' : 'error'}`}
                      >
                        {
                          compareStringVersion(v.version, dbVersion) <= 0 ? '已同步' :
                          <span>
                            {synchronous[v.version] ?
                              <span>
                                <Icon className='anticon-spin' type='loading1' style={{marginRight: 5}}/>
                                正在同步
                              </span> : '未同步'}
                          </span>
                        }
                      </div>
                      <span
                        title='点击查看变更详情'
                        className='pdman-db-version-list-item-tag-message'
                        onClick={() => this._showChanges(v.changes,
                          index === (versions.length - 1), v, versions[index + 1] || v, dbVersion)}
                      >
                        {v.version}: {v.message}
                      </span>
                      <span className='pdman-db-version-list-item-tag-icon'>
                        <Icon type='edit' onClick={() => this._editVersion(index, v)}/>
                        <Icon
                          style={{display: index === 0 ? '' : 'none'}}
                          type='delete'
                          onClick={() => this._deleteVersion(v)}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>);
  }
}
