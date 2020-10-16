import React from 'react';
import _object from 'lodash/object';
import { generateByJar } from '../../../../utils/office';
import { Modal, TreeSelect, Icon  } from '../../../../components';

export default class Parse extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      flag: true,
      status: true,
      data: {},
      exists: [],
      keys: [],
    };
  }
  componentDidMount() {
    const { dataSource, db = {}, dataFormat } = this.props;
    generateByJar(dataSource, {
      ...db.properties,
      flag: dataFormat,
    }, (error, stdout, stderr) => {
      const result = (stdout || stderr);
      let tempResult = '';
      try {
        tempResult = JSON.parse(result);
      } catch (e) {
        tempResult = result;
      }
      if (tempResult.status === 'SUCCESS') {
        this.setState({
          data: tempResult.body || tempResult,
          exists: this.checkField(tempResult.body || tempResult),
          status: 'SUCCESS',
        });
      } else {
        this.setState({
          status: 'FAILED',
        });
        Modal.error({title: '数据库解析失败！', message: tempResult.body || tempResult});
      }
      this.setState({
        flag: false,
      });
    }, 'dbReverseParse');
  }
  getSelectedEntity = (cb) => {
    // 增加提示
    const { exists, data } = this.state;
    if (this.state.keys.some(k => exists.includes(k.title))){
      Modal.confirm({
        title: '温馨提示',
        message: '勾选的数据表中包含模型中已经存在的数据表，继续操作将会覆盖模型中的数据，是否继续？',
        onOk: (m) => {
          m && m.close();
          cb && cb(this.state.keys, data);
        },
      });
    } else {
      cb && cb(this.state.keys, data);
    }
  };
  getAllTable = (dataSource) => {
    return (dataSource.modules || []).reduce((a, b) => {
      return a.concat((b.entities || []).map(entity => entity.title));
    }, []);
  };
  // 查找已经重复的数据表
  checkField = (data) => {
    const tempExists = [];
    const { dataSource } = this.props;
    // 当前模型中已经拥有的数据表
    const allTable = this.getAllTable(dataSource);
    // 从数据库解析中获取到的数据表
    const entities = _object.get(data, 'module.entities', []).map(d => d.title);
    entities.forEach((e) => {
      if (allTable.includes(e)) {
        tempExists.push(e);
      }
    });
    return tempExists;
  };
  _titleRender = (c) => {
    const { exists } = this.state;
    if (exists.includes(c.title)){
      return <span style={{color: 'red'}}>{c.chnname || c.title}({c.title})[已存在]</span>;
    }
    return `${c.chnname || c.title}(${c.title})`;
  };
  _getProperties = (obj) => {
    if (typeof obj === 'string') {
      return obj;
    } else if (Array.isArray(obj)) {
      return obj.map(o => `${o[0]}:${o[1]}`).join('\n');
    }
    return Object.keys(obj).map(f => `${f}:${obj[f]}`).join('\n');
  };
  _onChange = (keys) => {
    const { data } = this.state;
    const entities = _object.get(data, 'module.entities', []);
    this.setState({
      keys: keys
        .filter(k => k.split('/').length > 1)
        .map((k) => {
          const key = k.split('/')[1];
          return entities.filter(e => e.title === key)[0];
        }).filter(k => !!k),
    });
  };
  render() {
    const { data, flag, status, exists } = this.state;
    const module = _object.get(data, 'module', '');
    return (<div>
      <div style={{textAlign: 'center'}}>
        {
          flag ? <div><Icon className='anticon-spin' type='loading1' style={{marginRight: 5}}/>
            正在解析数据库，请稍后。。。(请勿关闭当前弹窗！)</div> : null
        }
      </div>
      {
        !flag && (status === 'SUCCESS' ?
          <div style={{textAlign: 'center'}}>解析结束：当前解析数据库【{data.dbType}】</div> :
          <div style={{textAlign: 'center'}}>解析结束：解析失败</div>)
      }
      <div>
        {
          !flag && <span style={{color: 'green'}}>解析结果：{status === 'SUCCESS' ?
            <span>共解析出【<span style={{color: '#000000'}}>{module.entities.length}</span>】张数据表，
            当前模型中已经存在的有【<span style={{color: 'red'}}>{exists.length}</span>】张表，请勾选需要添加到模型中的数据表！
            </span> : '失败'}</span>
        }
        {
          !flag && (status === 'SUCCESS' ?
            <TreeSelect
              onChange={this._onChange}
              data={module ? [module] : []}
              titleRender={this._titleRender}
            />
            : <div>{this._getProperties(data)}</div>)
        }
      </div>
    </div>);
  }
}
