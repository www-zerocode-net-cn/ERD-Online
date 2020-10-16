import React from 'react';
import ReactDom from 'react-dom';
import _object from 'lodash/object';
import {Input, Checkbox, Editor, openModal, Button, Modal} from '../../../components';
import * as Utils from './DatabaseUtils';
import './style/index.less';
import TemplateHelp from './TemplateHelp';
import TemplatePreviewEdit from './TemplatePreviewEdit';
import { getDemoTemplateData } from '../../../utils/json2code';
import defaultData from '../../defaultData.json';

class Database extends React.Component{
  static Utils = Utils;
  constructor(props){
    super(props);
    this.defaultTemplates = _object.get(defaultData, 'profile.defaultDataTypeDomains.database', []);
    this.templateNames = [
      { name: '创建数据表', value: 'createTableTemplate' },
      { name: '删除数据表', value: 'deleteTableTemplate' },
      { name: '重建数据表', value: 'rebuildTableTemplate' },
      { name: '添加字段', value: 'createFieldTemplate' },
      { name: '修改字段', value: 'updateFieldTemplate' },
      { name: '删除字段', value: 'deleteFieldTemplate' },
      { name: '删除索引', value: 'deleteIndexTemplate' },
      { name: '创建索引', value: 'createIndexTemplate' },
      { name: '表注释', value: 'updateTableComment' }];
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
    }
    const onAllOk = () => {
      modal && modal.close();
      const { value = {} } = this.state;
      const currentTemplate = this.defaultTemplates.filter((t) => t.code.toLocaleLowerCase()
        === templateHelp.getCurrentDb().toLocaleLowerCase())[0];
      this.setState({
        value: {
          ...value,
          ...(this.templateNames.reduce((a, b) => {
            return {
              ...a,
              [b.value]: currentTemplate[b.value],
            }
          }, {}))
        }
      });
    };
    const onCancel = () => {
      modal && modal.close();
    };
    modal = openModal(<TemplateHelp didMount={instance}/>, {
      autoFocus: true,
      footer: [
        <Button key="onAllOk" onClick={onAllOk} type="primary">使用此数据库案例模板</Button>,
        <Button key="ok" onClick={onOk} style={{marginLeft: 10}} type="primary">使用此案例模板</Button>,
        <Button key="cancel" onClick={onCancel} style={{marginLeft: 10}}>关闭</Button>],
      title: '默认模板配置案例'
    })
  };
  _tabClick = (tabShow) => {
    this.setState({
      tabShow,
    });
  };
  _useAllDefaultTemplate = () => {
    const { code } = this.state.value;
    const currentTemplate = this.defaultTemplates.filter((t) => t.code.toLocaleLowerCase() === code.toLocaleLowerCase())[0];
    if (!currentTemplate) {
      Modal.error({
        title: '使用默认模板失败',
        message: '无匹配数据库，请点击[从默认模板中选取]选择需要使用的数据库模板'
      });
    } else {
      this.setState((state) => {
        return {
          ...state,
          value: {
            ...state.value,
            ...(this.templateNames.reduce((a, b) => {
              return {
                ...a,
                [b.value]: currentTemplate[b.value],
              }
            }, {}))
          }
        }
      });
    }
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
        <span  className={`${prefix}-database-summary-item-name`}>
          <span className={`${prefix}-database-summary-item-name-container`}>
            <span>模板配置</span>
            <span onClick={this._useAllDefaultTemplate}>全部默认</span>
          </span>
        </span>
        <div style={{border: 'solid 1px #9B9B9B', padding: 5}}>
          <div className={`${prefix}-data-table-content-tab`} style={{fontSize: 13}}>
            {
              this.templateNames.map((t) => {
                return <div
                  key={t.value}
                  onClick={() => this._tabClick(t.value)}
                  className={`${prefix}-data-table-content-tab${this.state.tabShow === t.value ? '-selected' : '-unselected'}`}
                >
                  {t.name}
                </div>
              })
            }
          </div>
          <div className={`${prefix}-data-tab-content`}>
            <div style={{ width: '100%' }}>
              <div
                className={`${prefix}-database-summary-item`}
                style={{display: 'flex', flexDirection: 'column'}}
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
