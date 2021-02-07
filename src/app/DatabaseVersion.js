import React from 'react';
import _object from 'lodash/object';
import moment from 'moment';
import {
    Button,
    Code,
    Editor,
    Icon,
    Input,
    Message,
    Modal,
    openModal,
    RadioGroup,
    Select,
    TextArea
} from '../components';
import {getAllDataSQL, getCodeByChanges} from '../utils/json2code';
import {checkVersionData} from '../utils/dbversionutils';
import {compareStringVersion} from '../utils/string';
import * as Save from '../utils/save';
import * as cache from '../utils/cache';
import * as File from '../utils/file';

import './style/dbVersion.less';
import EditOutlined from "@ant-design/icons/es/icons/EditOutlined";
import DeleteOutlined from "@ant-design/icons/es/icons/DeleteOutlined";
import {Badge, Button as AntButton, Card, Col, Divider, List, Row, Space, Tag, Tooltip} from "antd";
import PlusCircleOutlined from "@ant-design/icons/es/icons/PlusCircleOutlined";
import {createFromIconfontCN} from "@ant-design/icons";
import SyncOutlined from "@ant-design/icons/es/icons/SyncOutlined";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import ClockCircleOutlined from "@ant-design/icons/es/icons/ClockCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons/es/icons/ExclamationCircleOutlined";

const {Radio} = RadioGroup;

class ChangeCode extends React.Component {
    constructor(props) {
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
        const {data} = this.props;
        File.save(this.data || data, `${moment().format('YYYY-MM-D-h-mm-ss')}.sql`);
    };
    _valueChange = (e) => {
        this.data = e.target.value;
    };
    _execSQL = (updateDBVersion, type) => {
        const {execSQL, currentVersion, data, checkVersionCount} = this.props;
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
    };
    _iconClick = () => {
        const {width} = this.state;
        this.setState({
            width: width === '50%' ? '100%' : '50%',
        });
    };

    render() {
        const {width, again, synchronous, preSynchronous, flagSynchronous} = this.state;
        const {
            database = [], messages, data, code,
            currentVersion = {}, dbVersion, init
        } = this.props;
        const {version} = currentVersion;
        const selectCode = code || database.filter(db => db.defaultDatabase).map(db => db.code)[0];
        return (<div className='erd-change-code'>
            <Icon
                onClick={this._iconClick}
                className='erd-change-code-icon'
                type={width === '50%' ? 'verticleright' : 'verticleleft'}
                title={width === '50%' ? '点击收起变化信息' : '点击展开变化信息'}
                style={{left: width === '50%' ? '47%' : 10}}
            />
            <div
                className='erd-change-code-context'
                style={{width: width === '50%' ? '50%' : '0px', display: width === '50%' ? '' : 'none'}}>
                <span className='erd-change-code-context-header'>变化信息</span>
                <div>
                    {
                        messages.length > 0 ?
                            messages.map((m, index) => (<div key={m.message}>{`${index + 1}:${m.message}`}</div>)) :
                            `${data ? '当前脚本为全量脚本' : '当前版本无变化'}`
                    }
                </div>
            </div>
            <div className='erd-change-code-context' style={{width: width}}>
        <span className='erd-change-code-context-header'>
          {
              version ? `变化脚本(${compareStringVersion(version, dbVersion) <= 0 ?
                  '已同步' : '未同步'})` : '变化脚本'
          }
        </span>
                <div>
                    <div
                        className='erd-data-table-content-tab'
                    >
                        <div
                            key={selectCode}
                            className='erd-data-table-content-tab-selected'
                        >
                            {selectCode}
                        </div>
                    </div>
                    <div className='erd-data-tab-content'>
                        <Button style={{marginBottom: 10}} key="save" onClick={this._onSave}>导出到文件</Button>

                        <Button
                            loading={synchronous}
                            title='会更新数据库中的版本号'
                            style={{
                                marginLeft: 10,
                                display: (version && compareStringVersion(version, dbVersion) > 0) ? '' : 'none',
                            }}
                            onClick={() => this._execSQL(true, 'synchronous')}
                        >
                            {synchronous ? '正在同步' : '同步'}
                        </Button>
                        <Button
                            loading={flagSynchronous}
                            title='更新数据库的版本号，不会执行差异化的SQL'
                            style={{
                                marginLeft: 10,
                                display: (version && compareStringVersion(version, dbVersion) > 0) ? '' : 'none',
                            }}
                            onClick={() => this._execSQL(true, 'flagSynchronous')}
                        >
                            {flagSynchronous ? '正在标记为同步' : '标记为同步'}
                        </Button>
                        <Button
                            loading={again}
                            title='不会更新数据库中的版本号'
                            style={{
                                display: (version && compareStringVersion(version, dbVersion) <= 0) ? '' : 'none',
                                marginLeft: 10,
                            }}
                            onClick={() => this._execSQL(false, 'again')}
                        >
                            {again ? '正在执行' : '再次执行'}</Button>
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

class CustomerVersionCheck extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            changes: [],
            dbVersion: {
                initVersion: (props.versions[1] && props.versions[1].version) || '',
                incrementVersion: (props.versions[0] && props.versions[0].version) || '',
            },
            incrementVersionData: {modules: []},
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
        const {dbVersion} = this.state;
        const {versions} = this.props;
        if (!dbVersion.initVersion || !dbVersion.incrementVersion) {
            Modal.error({title: '比较失败', message: '请选择你要比较的两个版本'});
        }
        if (compareStringVersion(dbVersion.incrementVersion, dbVersion.initVersion) <= 0) {
            Modal.error({title: '比较失败', message: '增量脚本的版本号不能小于或等于初始版本的版本号'});
        } else {
            // 读取两个版本下的数据信息
            let incrementVersionData = {};
            let initVersionData = {};
            versions.forEach((v) => {
                if (v.version === dbVersion.initVersion) {
                    initVersionData = {modules: v.projectJSON.modules};
                }
                if (v.version === dbVersion.incrementVersion) {
                    incrementVersionData = {modules: v.projectJSON.modules};
                }
            });
            const changes = checkVersionData(incrementVersionData, initVersionData);
            this.setState({
                changes,
                incrementVersionData,
            });
        }
    };

    render() {
        const {versions, dbData, constructorMessage, defaultDB, dataSource} = this.props;
        const {changes, dbVersion, incrementVersionData} = this.state;
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

class DatabaseVersionContext extends React.Component {
    onChange = (e, name) => {
        const {defaultVersion} = this.props;
        if (!this.value) {
            this.value = {};
        }
        this.value[name] = e.target.value;
        const {onChange} = this.props;
        onChange && onChange({
            ...this.value,
            version: this.value.version || defaultVersion || this.getNewVersion(),
        });
    };
    getNewVersion = () => {
        const {versions} = this.props;
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
        const {versionReadonly, defaultVersion, defaultMessage} = this.props;
        return (<div className='erd-db-version-context'>
            <div className='erd-db-version-context-item'>
                <span>版本号：</span>
                <Input
                    disabled={versionReadonly}
                    style={{width: '100%'}}
                    defaultValue={defaultVersion || this.getNewVersion()}
                    placeholder='例如：v1.0.0【请勿低于系统默认的数据库版本v0.0.0】'
                    onChange={e => this.onChange(e, 'version')}/>
            </div>
            <div className='erd-db-version-context-item'>
                <span>版本描述：</span>
                <TextArea
                    defaultValue={defaultMessage}
                    wrapperStyle={{width: '100%'}}
                    style={{width: '100%'}}
                    placeholder='例如：初始化当前项目版本'
                    onChange={e => this.onChange(e, 'versionDesc')}/>
            </div>
        </div>);
    }
}

class ReadDB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...props.data,
        };
    }

    _onChange = () => {
        const {onChange} = this.props;
        onChange && onChange(this.state);
    };
    _upgradeTypeChange = (upgradeType) => {
        this.setState({
            upgradeType,
        }, () => {
            this._onChange();
        });
    };

    render() {
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
        </div>);
    }
}

const MyIcon = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1485538_zhb6fnmux9a.js', // 在 iconfont.cn 上生成
});

export default class DatabaseVersion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            init: true,
            versions: props.versions,
            dbs: _object.get(props.dataSource, 'profile.dbs', []),
            dbVersion: props.dbVersion,
            changes: [],
            configData: props.configJSON || {},
            defaultDB: (_object
                .get(props.dataSource, 'dataTypeDomains.database', [])
                .filter(db => db.defaultDatabase)[0] || {}).code,
            synchronous: {},
        };
        this.projectId = cache.getItem('projectId');
        moment().local();
    }

    componentDidMount() {
        // 获取所有的版本json
        const {versions} = this.props;
        const data = versions;
        this._checkBaseVersion(data);
        this._getVersionMessage(data);
        this._getDBVersion();
        // 将当前的内容和最新的版本进行比较
        this.setState({ // eslint-disable-line
            changes: this._calcChanges(data),
        });
    }

    _saveConfigData = (data) => {
        const {updateConfig} = this.props;
        updateConfig && updateConfig(data);
    };
    _getVersionMessage = (versionData, only) => {
        const {versions = []} = this.state;
        let tempVersions = [];
        if (Array.isArray(versionData)) {
            tempVersions = versionData;
        } else if (versionData) {
            tempVersions = only ? [].concat(versionData) : versions.concat(versionData);
        }
        this.setState({
            versions: tempVersions.map(data => _object.pick(data,
                ['id', 'version', 'versionDesc', 'changes', 'versionDate', 'projectJSON', 'baseVersion']))
                .sort((a, b) => compareStringVersion(b.version, a.version)),
        });
    };
    _checkBaseVersion = (data) => {
        // 判断基线版本文件是否存在
        if (data.some(d => d.baseVersion)) {
            this.setState({
                init: false,
            });
        } else {
            Message.error({title: '当前项目不存在基线版本，请先初始化基线'});
            this.setState({
                init: true,
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
            this.allMatchCount = (this.tempHtml.match(regExp) && this.tempHtml.match(regExp).length) || 0;
            this.countDom.innerHTML = `${this.allMatchCount === 0 ? 0 : 1}/${this.allMatchCount}`;
            this.code.innerHTML = (this.tempHtml || '')
                .replace(regExp, `<span class='erd-select-value'>${this.searchValue}</span>`);
        } else {
            this.countDom.innerHTML = '0/0';
            this.code.innerHTML = this.tempHtml;
        }
        // 获取top值
        const top = document.body.clientHeight * 0.15 + 76;
        const left = document.body.clientWidth * 0.10 + 16;
        const modalWidth = document.body.clientWidth * 0.8 - 32;
        this.spans = Array.from(this.code.querySelectorAll('.erd-select-value'));
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
    };
    _connectJDBC = (param, opt, cb) => {
        let modal = null;
        const onOk = () => {
            modal && modal.close();
        };
        if (param.showModal) {
            modal = openModal(<Code
                style={{height: 300}}
                data='执行同步命令：dbversion'
            />, {
                title: '开始同步，同步结束后当前窗口将会自动关闭！',
                width: '50%',
                footer: [<Button style={{marginTop: 10}} key="ok" onClick={onOk} type="primary">关闭</Button>],
            });
        }
        Save[opt](param).then((res) => {
            cb && cb(res);
        }).catch((err) => {
            Modal.error({title: '同步失败!', message: `同步失败:${err.message}`});
        }).finally(() => {
            modal && modal.close();
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
    _generateSQL = (dbData, version, data, updateVersion, cb, onlyUpdateVersion) => {
        // 判断是否是标记为同步还是同步
        const cmd = this._getCMD(updateVersion, onlyUpdateVersion);
        // 获取外层目录
        const {dataSource} = this.props;
        if (dbData) {
            const sqlParam = {};
            if (updateVersion) {
                sqlParam.versionDesc = version.versionDesc;
                sqlParam.version = version.version;
            }
            if (!onlyUpdateVersion) {
                const separator = _object.get(dataSource, 'profile.sqlConfig', '/*SQL@Run*/');
                sqlParam.sql = data;
                sqlParam.separator = separator;
            }
            const dbConfig = _object.omit(dbData.properties, ['driver_class_name']);
            this._connectJDBC({
                ...dbConfig,
                driverClassName: dbData.properties['driver_class_name'], // eslint-disable-line
                ...sqlParam,
                showModal: true,
            }, cmd, (result) => {
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
                        width: '50%',
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
                                    style={{marginLeft: 10, cursor: 'pointer'}}
                                >
                      0/0
                </span>
                                <Icon style={{marginLeft: 10, cursor: 'pointer'}} type='arrowdown'
                                      onClick={this._selectNext}/>
                                <Icon style={{marginLeft: 10, cursor: 'pointer'}} type='arrowup'
                                      onClick={this._selectPre}/>
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
                        </div>
                    });
                    updateVersion && this._getDBVersion();
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
                                    style={{marginLeft: 10, cursor: 'pointer'}}
                                >
                      0/0
                </span>
                                <Icon style={{marginLeft: 10, cursor: 'pointer'}} type='arrowdown'
                                      onClick={this._selectNext}/>
                                <Icon style={{marginLeft: 10, cursor: 'pointer'}} type='arrowup'
                                      onClick={this._selectPre}/>
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
        }
    };
    // 校验需要同步的版本是否存在跨版本同步的问题
    _checkVersionCount = (version) => {
        const {dbVersion, versions} = this.state;
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
            this.setState({
                dbVersion: '',
            });
            Modal.error({
                title: '初始化数据库版本表失败',
                message: '无法获取到数据库信息，请切换尝试数据库'
            });
            cb && cb();
        } else {
            this._generateSQL(dbData, version, data, updateDBVersion, cb, onlyUpdateDBVersion);
        }
    };
    _readDb = (status, version, lastVersion, changes = [], initVersion, updateVersion) => {
        if (!status) {
            const dbData = this._getCurrentDBData();
            if (!dbData) {
                Modal.error({
                    title: '同步失败',
                    message: '无法获取到数据库信息，' +
                        '请尝试切换数据库，并检查是否已经配置数据库信息！'
                });
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
                        width: '40%',
                        message: '数据即将同步到数据库，同步后不可撤销，确定同步吗？',
                        onOk: (m) => {
                            this.setState({
                                synchronous: {
                                    ...this.state.synchronous,
                                    [version.version]: true,
                                },
                            });
                            m && m.close();
                            const {configData} = this.state;
                            let tempValue = {
                                upgradeType: _object.omit(configData.synchronous || {}, ['readDBType']) || 'rebuild',
                            };
                            let data = '';
                            // 判断是否为初始版本，如果为初始版本则需要生成全量脚本
                            if (initVersion) {
                                data = getAllDataSQL({
                                    ...this.props.dataSource,
                                    modules: version.projectJSON.modules,
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
                                        modules: version.projectJSON.modules,
                                    }, tempChanges,
                                    _object.get(dbData, 'type', this.state.defaultDB), lastVersion.projectJSON);
                            }
                            this._generateSQL(dbData, version, data, updateVersion);
                        }
                    });
                }
            }
        }
    };
    _initBase = (message) => {
        let tempValue = {};
        const onChange = (value) => {
            tempValue = value;
        };
        openModal(<DatabaseVersionContext versions={this.state.versions} onChange={onChange}/>, {
            title: '版本信息',
            width: '40%',
            onOk: (modal) => {
                if (!tempValue.version || !tempValue.versionDesc) {
                    Modal.error({title: '操作失败', message: '版本号和版本描述不能为空', width: 200});
                } else {
                    const {dataSource} = this.props;
                    // 基线文件只需要存储modules信息
                    const version = {
                        projectJSON: {
                            modules: dataSource.modules || [],
                        },
                        baseVersion: true,
                        version: tempValue.version,
                        versionDesc: tempValue.versionDesc,
                        changes: [],
                        versionDate: moment().format('YYYY/M/D H:m:s'),
                    };
                    if (message) {
                        Save.hisProjectDeleteAll().then(() => {
                            this._initSave(version, modal, message);
                        }).catch((err) => {
                            Modal.error({title: '重建基线失败！', message: `重建基线失败:${err.message}`});
                        });
                    } else {
                        this._initSave(version, modal, message);
                    }
                }
            },
        });
    };
    _initSave = (version, modal, message) => {
        Save.hisProjectSave(version).then((res) => {
            if (res) {
                Message.success({title: message || '初始化基线成功'});
                this._getVersionMessage(res.body, true);
                modal && modal.close();
                this.setState({
                    changes: [],
                    init: false,
                    versions: res.body,
                });
                // 更新版本表
                this._dropVersionTable();
            } else {
                Modal.error({title: '操作失败！'});
            }
        }).catch((err) => {
            Modal.error({title: '操作失败！', message: err.message});
        });
    };
    _dropVersionTable = () => {
        const dbData = this._getCurrentDBData();
        if (!dbData) {
            this.setState({
                dbVersion: '',
            });
            Modal.error({
                title: '初始化数据库版本表失败',
                message: '无法获取到数据库信息，请切换尝试数据库'
            });
        } else {
            const dbConfig = _object.omit(dbData.properties, ['driver_class_name']);
            Save.rebaseline({
                ...dbConfig,
                driverClassName: dbData.properties['driver_class_name'], // eslint-disable-line
                version: 'v0.0.0',
                versionDesc: '基线版本，新建版本时请勿低于该版本',
            }).then((res) => {
                if (res && res.status === 'SUCCESS') {
                    Message.success({title: '初始化数据表成功'});
                    this._getDBVersion();
                } else {
                    Message.error({title: '初始化数据表失败'});
                }
            }).catch((err) => {
                Modal.error({
                    title: '初始化数据表失败！',
                    message: `初始化数据表失败：${err.message}`,
                });
            });
        }
    };
    _rebuild = () => {
        Modal.confirm({
            title: '重建基线',
            message: '重建基线将会清除当前项目的所有版本信息，该操作不可逆，是否继续？',
            onOk: (modal) => {
                modal.close();
                // 重新初始化
                // 先删除所有的版本信息
                this._initBase('重建基线成功');
            }
        });
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
    _saveNewVersion = () => {
        const {versions} = this.state;
        const changes = this._calcChanges(versions);
        let tempValue = {};
        const onChange = (value) => {
            tempValue = value;
        };
        openModal(<DatabaseVersionContext versions={this.state.versions} onChange={onChange}/>, {
            title: '版本信息',
            width: '40%',
            onOk: (modal) => {
                if (!tempValue.version || !tempValue.versionDesc) {
                    Modal.error({title: '操作失败', message: '版本号和版本描述不能为空', width: 200});
                } else if (this.state.versions.map(v => v.version).includes(tempValue.version)) {
                    Modal.error({title: '操作失败', message: '该版本号已经存在了', width: 200});
                } else if (this.state.versions[0] &&
                    compareStringVersion(tempValue.version, this.state.versions[0].version) <= 0) {
                    Modal.error({title: '操作失败', message: '新版本不能小于或等于已经存在的版本'});
                } else {
                    const version = {
                        projectJSON: {
                            modules: this.props.dataSource.modules || [],
                        },
                        baseVersion: false,
                        version: tempValue.version,
                        versionDesc: tempValue.versionDesc,
                        changes,
                        versionDate: moment().format('YYYY/M/D H:m:s'),
                    };
                    Save.hisProjectSave(version).then((res) => {
                        modal && modal.close();
                        if (res && res.status === 'SUCCESS') {
                            this._getVersionMessage(res.data);
                            this.setState({
                                changes: [],
                                versions: res.body,
                            });
                            Message.success({title: '当前版本保存成功'});
                        } else {
                            Modal.error({
                                title: '当前版本保存失败！',
                                message: '当前版本保存失败',
                            });
                        }
                    }).catch((err) => {
                        Modal.error({
                            title: '当前版本保存失败！',
                            message: `当前版本保存失败:${err.message}`,
                        });
                    });
                }
            },
        });
    };
    _calcChanges = (data) => {
        const {dataSource} = this.props;
        const changes = [];
        let checkVersion = data.sort((a, b) => compareStringVersion(b.version, a.version))[0];
        if (checkVersion) {
            // 读取当前版本的内容
            const currentDataSource = {...dataSource};
            const checkDataSource = {
                modules: _object.get(checkVersion, 'projectJSON.modules', []),
            };
            // 组装需要比较的版本内容
            // 循环比较每个模块下的每张表以及每一个字段的差异
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
            return changes;
        }
        return [];
    };
    _getOptName = (opt) => {
        let optName = '';
        switch (opt) {
            case 'update':
                optName = '更新';
                break;
            case 'add':
                optName = '新增';
                break;
            case 'delete':
                optName = '删除';
                break;
            default:
                optName = '未知操作';
                break;
        }
        return optName;
    };
    _getTypeName = (type) => {
        let optName = '';
        switch (type) {
            case 'entity':
                optName = '表';
                break;
            case 'index':
                optName = '索引';
                break;
            case 'field':
                optName = '属性';
                break;
            default:
                optName = '未知类型';
                break;
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
        const {init, configData} = this.state;
        const {dataSource} = this.props;
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
                    modules: currentVersion.projectJSON ? currentVersion.projectJSON.modules : currentVersion.modules,
                }, code) :
                getCodeByChanges({
                    ...dataSource,
                    modules: currentVersion.projectJSON ? currentVersion.projectJSON.modules : currentVersion.modules,
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
            width: '60%',
            footer: [
                <Button style={{marginTop: 10}} key="ok" onClick={onOk} type="primary">关闭</Button>,
            ],
        });
    };
    _getDBVersion = () => {
        // 模拟返回1.0.1
        this.setState({
            versionData: true,
        });
        const dbData = this._getCurrentDBData();
        if (!dbData) {
            this.setState({
                dbVersion: '',
            });
            Message.error({
                title: '获取数据库版本信息失败,无法获取到数据库信息,请切换尝试数据库！',
            });
            this.setState({
                versionData: false,
            });
        } else {
            const dbConfig = _object.omit(dbData.properties, ['driver_class_name']);
            Save.dbversion({
                ...dbConfig,
                driverClassName: dbData.properties['driver_class_name'], // eslint-disable-line
            }).then((res) => {
                if (res && res.status === 'SUCCESS') {
                    Message.success({title: '数据库版本信息获取成功'});
                } else {
                    Message.error({title: '数据库版本信息获取失败', message: res.body || res});
                }
                this.setState({
                    dbVersion: res.status !== 'SUCCESS' ? '' : res.body,
                });
            }).catch((err) => {
                Message.error({title: '数据库版本信息获取失败', message: err.message});
            }).finally(() => {
                this.setState({
                    versionData: false,
                });
            });
        }
    };
    _getCurrentDBData = () => {
        const {dbs} = this.state;
        return dbs.filter(d => d.defaultDB)[0];
    };
    _getCurrentDB = () => {
        const {dbs} = this.state;
        const db = dbs.filter(d => d.defaultDB)[0];
        if (db) {
            return db.name;
        }
        return '';
    };
    _dbChange = (e) => {
        const {dbs} = this.state;
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
        const {configData} = this.state;
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
            width: '50%',
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
        const {versions} = this.state;
        const {dataSource} = this.props;
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
            width: '60%',
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
            };
        };
        openModal(<DatabaseVersionContext
            versions={this.state.versions}
            onChange={onChange}
            versionReadonly={index !== 0}
            defaultVersion={version.version}
            defaultMessage={version.versionDesc}
        />, {
            title: '修改版本信息',
            onOk: (modal) => {
                const tempVersions = this.state.versions.slice(1);
                if (!tempValue.version || !tempValue.versionDesc) {
                    Modal.error({title: '操作失败', message: '版本号和版本描述不能为空', width: 200});
                } else if (index !== 0) {
                    this._updateVersionData(tempValue, version, 'update', () => {
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
                    compareStringVersion(tempValue.version, tempVersions[0].version) <= 0) {
                    Modal.error({title: '操作失败', message: '新版本不能小于或等于已经存在的版本'});
                } else {
                    this._updateVersionData(tempValue, version, 'update', () => {
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
                this._updateVersionData(tempVersion, tempVersion, 'delete', () => {
                    m && m.close();
                });
            }
        });
    };
    _updateVersionData = (newVersion, oldVersion, status, cb) => {
        if (status === 'update') {
            Save.hisProjectSave(newVersion).then(() => {
                Message.success({title: '版本信息更新成功'});
            }).catch((err) => {
                Message.success({title: `版本信息更新失败${err.message}`});
            }).finally(() => {
                cb && cb();
            });
        } else {
            // 删除原来的
            Save.hisProjectDelete(newVersion.id).then(() => {
                Message.success({title: '版本信息删除成功'});
                const tempVersions = this.state.versions.filter(v => v.id !== newVersion.id);
                this.setState({
                    changes: this._calcChanges(tempVersions),
                    versions: tempVersions,
                });
                this._checkBaseVersion(tempVersions);
            }).catch((err) => {
                Message.success({title: `版本信息更新失败${err.message}`});
            }).finally(() => {
                cb && cb();
            });
        }
    };

    render() {
        const {init, versionData, versions, dbVersion, changes, dbs, synchronous} = this.state;
        const currentDB = this._getCurrentDB();

        return (
            <div style={{border: "solid 1px #9B9B9B"}}>
                <Card>
                    {
                        changes.length > 0
                            ?
                            <AntButton type={"link"} onClick={() => this._showChanges(changes, false,
                                this.props.dataSource, versions[0] || this.props.dataSource)}>
                                <Badge status="error"/>当前内容与上一版本的内容有变化，但未保存版本！
                            </AntButton>
                            : <Badge status="success" text="当前内容与上一版本内容无变化"/>
                    }
                    <div className='erd-db-version-opt'>
                            <span style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            切换数据库：
                            <Select value={currentDB} style={{minWidth: 200}} onChange={this._dbChange}>
                            <option key='' value=''>-请选择-</option>
                                {
                                    dbs.map(db => (<option key={db.name} value={db.name}>{db.name}</option>))
                                }
                            </Select>
                            </span>
                    </div>
                    <Divider style={{marginBottom: "0px"}}/>
                    <List
                        size="large"
                        rowKey="id"
                        dataSource={versions}
                        renderItem={(v, index) => (
                            <List.Item>
                                <Row align={"left"} style={{width: "350px"}}>
                                    <Col span={6}>
                                        <AntButton
                                            type="link"
                                            onClick={() => this._showChanges(v.changes,
                                                v.baseVersion, v, versions[index + 1] || v, dbVersion)}
                                        >
                                            <Tooltip title={v.versionDate.concat(':').concat(v.versionDesc)}
                                                     color={"green"} key={"green"}>
                                                {v.version}
                                            </Tooltip>
                                        </AntButton>
                                    </Col>
                                    <Col span={6}>
                                        {
                                            compareStringVersion(v.version, dbVersion) <= 0 ?
                                                <Tag icon={<CheckCircleOutlined/>} color="success">
                                                    已同步
                                                </Tag> :
                                                <span>
                            {synchronous[v.version] ?
                                <Tag icon={<SyncOutlined spin/>} color="processing">
                                    正在同步
                                </Tag> : <Tag icon={<ExclamationCircleOutlined/>} color="error">
                                    未同步
                                </Tag>}
                          </span>
                                        }
                                    </Col>
                                    <Col span={12}>
                                        <Space>


                                            <MyIcon
                                                type="icon-Comparewiththecurrent" title={"任意版本比较"}
                                                onClick={this._customerVersionCheck}/>
                                            <Divider type="vertical"/>
                                            <EditOutlined
                                                title={"编辑版本"}
                                                onClick={() => this._editVersion(index, v)}
                                            />
                                            <Divider type="vertical"/>
                                            <DeleteOutlined
                                                title={"删除版本"}
                                                onClick={() => this._deleteVersion(v)}/>
                                            <Divider type="vertical"/>
                                            {
                                                compareStringVersion(v.version, dbVersion) <= 0 ? '' :
                                                    synchronous[v.version] ?
                                                        '' :
                                                        < SyncOutlined
                                                            title={"同步到数据库"}
                                                            onClick={() => this._readDb(
                                                                compareStringVersion(v.version, dbVersion) <= 0,
                                                                v,
                                                                versions[index + 1] || v, v.changes,
                                                                index === (versions.length - 1), true)}
                                                        />
                                            }
                                            {
                                                compareStringVersion(v.version, dbVersion) == 0 ?
                                                    < MyIcon
                                                        type="icon-book-mark" title={"当前数据库版本"}
                                                    /> : ''
                                            }
                                        </Space>
                                    </Col>
                                </Row>
                            </List.Item>
                        )}
                    />
                    <AntButton
                        type="dashed"
                        style={{width: '100%', marginTop: 8, display: init ? 'none' : ''}}
                        icon={<PlusCircleOutlined/>}
                        onClick={() => this._saveNewVersion()}
                    >
                        新增版本
                    </AntButton>
                    <AntButton
                        type="dashed"
                        style={{width: '100%', marginTop: 8}}
                        icon={<SyncOutlined/>}
                        onClick={() => this._synchronousConfig()}
                    >
                        同步配置
                    </AntButton>
                    <AntButton
                        type="dashed"
                        style={{width: '100%', marginTop: 8, display: init ? '' : 'none'}}
                        icon={<MyIcon type={"icon-initial"}/>}
                        onClick={() => this._initBase()}
                    >
                        初始化基线
                    </AntButton>
                    <AntButton
                        type="dashed"
                        style={{width: '100%', marginTop: 8, display: init ? 'none' : ''}}
                        icon={<MyIcon type={"icon-rebuild"}/>}
                        onClick={() => this._rebuild()}
                    >
                        重建基线
                    </AntButton>
                </Card>


            </div>
        );
    }
}
