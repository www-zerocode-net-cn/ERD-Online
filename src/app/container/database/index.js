import React from 'react';
import ReactDom from 'react-dom';
import _object from 'lodash/object';
import {Input, Checkbox, Editor, openModal, Button} from '../../../components';
import * as Utils from './DatabaseUtils';
import './style/index.less';
import TemplateHelp from './TemplateHelp';
import TemplatePreviewEdit from './TemplatePreviewEdit';
import { getDemoTemplateData } from '../../../utils/json2code';

class Database extends React.Component{
  static Utils = Utils;
  constructor(props){
    super(props);
    this.state = {
      value: props.value || {},
      parentWidth: '490px',
      tabShow: 'createTableTemplate',
    };
  }
  componentDidMount(){
    this.dom = ReactDom.findDOMNode(this.instance);
    /* eslint-disable */
    this.setState({
      parentWidth: `${this.dom.getBoundingClientRect().width - 120}px`,
    });
  }
  save = () => {
    return this.state.value;
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
  _valueChange = (e, type) => {
    const { value } = this.state;
    this.setState({
      value: {
        ...value,
        [type]: e.target.value,
      },
    });
  };
  _previewEdit = (tabShow, mode, value) => {
    openModal(<TemplatePreviewEdit
      value={value}
      mode={mode}
      demoData={getDemoTemplateData(tabShow)}
    />, {
      title: '模板预览编辑',
      autoFocus: true,
      fullScreen: true,
      onOk: (m, c) => {
        this.setState({
          value: {
            ...this.state.value,
            [tabShow]: c.getValue() || '',
          }
        }, () => {
          m && m.close();
        });
      },
    })
  };
  _openHelp = (tabShow) => {
    let modal = null;
    let templateHelp = null;
    const instance = (instance) => {
      templateHelp = instance;
    };
    const onOk = () => {
      modal && modal.close();
      const { value = {} } = this.state;
      this.setState({
        value: {
          ...value,
          [tabShow]: templateHelp && templateHelp.getTemplate() || value[tabShow] || ''
        }
      });
    };
    const onCancel = () => {
      modal && modal.close();
    };
    modal = openModal(<TemplateHelp didMount={instance}/>, {
      autoFocus: true,
      footer: [
        <Button key="ok" onClick={onOk} type="primary">使用此案例模板</Button>,
        <Button key="cancel" onClick={onCancel} style={{marginLeft: 10}}>关闭</Button>],
      title: '默认模板配置案例'
    })
  };
  _tabClick = (tabShow) => {
    this.setState({
      tabShow,
    });
  };
  render(){
    const { value, parentWidth } = this.state;
    const { prefix = 'pdman' } = this.props;
    const mode = this._getMode(_object.get(value, 'code', '').toLocaleLowerCase());
    return (<div
      ref={instance => this.instance = instance}
      className={`${prefix}-database-summary`}
    >
      <div className={`${prefix}-database-summary-item`}>
        <span  className={`${prefix}-database-summary-item-name`}>数据库名</span>
        <Input
          autoFocus
          value={_object.get(value, 'code', '')}
          wrapperStyle={{width: 'calc(100% - 100px)'}}
          style={{width: '100%'}}
          onChange={e => this._valueChange(e, 'code')}
        />
      </div>
      <div className={`${prefix}-database-summary-item`}>
        <span  className={`${prefix}-database-summary-item-name`}>生成至文档</span>
        <Checkbox
          value={_object.get(value, 'fileShow', false)}
          wrapperStyle={{width: 'auto', marginRight: 5}}
          style={{alignSelf: 'center'}}
          onChange={e => this._valueChange(e, 'fileShow')}
        />
        <span
          style={{whiteSpace: 'nowrap', color: '#36AC55', textOverflow: 'ellipsis'}}
        >
          (勾选此项，将会在生成的文档中显示该数据库所对应的字段类型)
        </span>
      </div>
      <div className={`${prefix}-database-summary-item`}>
        <span  className={`${prefix}-database-summary-item-name`}>设为默认数据库</span>
        <Checkbox
          value={_object.get(value, 'defaultDatabase', false)}
          wrapperStyle={{width: 'auto', marginRight: 5}}
          style={{alignSelf: 'center'}}
          onChange={e => this._valueChange(e, 'defaultDatabase')}
        />
        <span
          style={{whiteSpace: 'nowrap', color: '#36AC55', textOverflow: 'ellipsis'}}
        >
          (勾选此项，将会在数据表和关系图中显示默认数据库的数据类型)
        </span>
      </div>
      <div className={`${prefix}-database-summary-item`}>
        <span  className={`${prefix}-database-summary-item-name`}>模板配置</span>
        <div style={{border: 'solid 1px #9B9B9B', padding: 5}}>
          <div className={`${prefix}-data-table-content-tab`} style={{fontSize: 13}}>
            <div
              onClick={() => this._tabClick('createTableTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'createTableTemplate' ? '-selected' : '-unselected'}`}
            >创建数据表
            </div>
            <div
              onClick={() => this._tabClick('deleteTableTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'deleteTableTemplate' ? '-selected' : '-unselected'}`}
            >删除数据表
            </div>
            <div
              onClick={() => this._tabClick('rebuildTableTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'rebuildTableTemplate' ? '-selected' : '-unselected'}`}
            >重建数据表
            </div>
            <div
              onClick={() => this._tabClick('createFieldTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'createFieldTemplate' ? '-selected' : '-unselected'}`}
            >添加字段
            </div>
            <div
              onClick={() => this._tabClick('updateFieldTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'updateFieldTemplate' ? '-selected' : '-unselected'}`}
            >修改字段
            </div>
            <div
              onClick={() => this._tabClick('deleteFieldTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'deleteFieldTemplate' ? '-selected' : '-unselected'}`}
            >删除字段
            </div>
            <div
              onClick={() => this._tabClick('deleteIndexTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'deleteIndexTemplate' ? '-selected' : '-unselected'}`}
            >删除索引
            </div>
            <div
              onClick={() => this._tabClick('createIndexTemplate')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'createIndexTemplate' ? '-selected' : '-unselected'}`}
            >创建索引
            </div>
            <div
              onClick={() => this._tabClick('updateTableComment')}
              className={`${prefix}-data-table-content-tab${this.state.tabShow === 'updateTableComment' ? '-selected' : '-unselected'}`}
            >表注释
            </div>
          </div>
          <div className={`${prefix}-data-tab-content`}>
            <div style={{ width: '100%' }}>
              <div
                className={`${prefix}-database-summary-item ${prefix}-database-summary-item-special`}
              >
              <div style={{marginBottom: 10, color: 'green'}}>
                <span
                  onClick={() => this._openHelp(this.state.tabShow)}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    float: 'right',
                    fontSize: 12
                  }}
                >从默认模板中选取</span>
                <span
                  onClick={() => this._previewEdit(this.state.tabShow, mode, _object.get(value, this.state.tabShow, ''))}
                  style={{
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >预览编辑</span>
              </div>
              <Editor
                width={parentWidth}
                height='230px'
                mode={mode}
                value={_object.get(value, this.state.tabShow, '')}
                onChange={e => this._valueChange(e, this.state.tabShow)}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
  }
}

export default Database;
