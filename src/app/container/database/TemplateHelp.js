import React from 'react';
import _object from 'lodash/object';
import { Code } from '../../../components';
import defaultData from '../../defaultData';

import './style/index.less';

export default class TemplateHelp extends React.Component{
  constructor(props){
    super(props);
    this.data = _object.get(defaultData, 'profile.defaultDataTypeDomains.database', []);
    this.state = {
      selected: 'MYSQL',
      templateShow: 'createTableTemplate',
    };
  }
  componentDidMount(){
    const { didMount } = this.props;
    didMount && didMount(this);
  }
  getCurrentDb = () => {
    return this.state.selected;
  };
  getTemplate = () => {
    const { selected, templateShow } = this.state;
    const db = this.data.filter(d => d.code === selected)[0];
    if (db) {
      return db[templateShow];
    }
    return '';
  };
  _getCurrentDB = () => {
    const { selected } = this.state;
    const db = this.data.filter(d => d.code === selected)[0];
    if (db) {
      return db;
    }
    return {};
  };
  _tabChange = (type) => {
    this.setState({
      selected: type,
    });
  };
  _templateTabClick = (templateShow) => {
    this.setState({
      templateShow,
    });
  };
  render(){
    const { selected } = this.state;
    const { prefix = 'pdman' } = this.props;
    const data = this.data;
    const currentDB = this._getCurrentDB();
    return (<div>
      <div className={`${prefix}-database-template-help-content-tab`}>
        {
          data.map(db => (<div
            key={`${db.code}`}
            onClick={() => this._tabChange(db.code)}
            className={`${prefix}-database-template-help-content-tab-${selected === db.code ? 'selected' : 'unselected'}`}
          >{db.code.toLocaleUpperCase()}</div>))
        }
      </div>
      <div
        className={`${prefix}-data-table-content-tab`}
        style={{marginTop: 5, fontSize: 12, marginBottom: 0}}
      >
        <div
          onClick={() => this._templateTabClick('createTableTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'createTableTemplate' ? '-selected' : '-unselected'}`}
        >
          新建数据表
        </div>
        <div
          onClick={() => this._templateTabClick('deleteTableTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'deleteTableTemplate' ? '-selected' : '-unselected'}`}
        >
          删除数据表
        </div>
        <div
          onClick={() => this._templateTabClick('rebuildTableTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'rebuildTableTemplate' ? '-selected' : '-unselected'}`}
        >
          重建数据表
        </div>
        <div
          onClick={() => this._templateTabClick('createFieldTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'createFieldTemplate' ? '-selected' : '-unselected'}`}
        >
          新增字段
        </div>
        <div
          onClick={() => this._templateTabClick('updateFieldTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'updateFieldTemplate' ? '-selected' : '-unselected'}`}
        >
          修改字段
        </div>

        <div
          onClick={() => this._templateTabClick('deleteFieldTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'deleteFieldTemplate' ? '-selected' : '-unselected'}`}
        >
          删除字段
        </div>

        <div
          onClick={() => this._templateTabClick('deleteIndexTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'deleteIndexTemplate' ? '-selected' : '-unselected'}`}
        >
          删除索引
        </div>

        <div
          onClick={() => this._templateTabClick('createIndexTemplate')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'createIndexTemplate' ? '-selected' : '-unselected'}`}
        >
          创建索引
        </div>
        <div
          onClick={() => this._templateTabClick('updateTableComment')}
          className={`${prefix}-data-table-content-tab${this.state.templateShow === 'updateTableComment' ? '-selected' : '-unselected'}`}
        >表注释
        </div>
      </div>
      <div className={`${prefix}-data-tab-content`}>
        <div>
          <Code
            language={currentDB.code !== 'Java' ? 'SQL' : 'Java'}
            data={currentDB[this.state.templateShow] || ''}
          />
        </div>
      </div>
    </div>);
  }
}
