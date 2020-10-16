import React from 'react';
import _object from 'lodash/object';
import * as Com from '../../../components';
import { getCodeByDataTable } from '../../../utils/json2code';
import { getCurrentVersionData } from '../../../utils/dbversionutils';


export default class TableDataCode extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      codesTabShow: '',
      templateShow: 'createTableTemplate',
      dataTable: this._getDataTable(props),
    };
    this._getChanges(props);
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.dataSource !== this.props.dataSource) {
      // 数据发生了变化
      this._getChanges(nextProps);
    }
    // 如果当前Tab为刚刚激活的状态，则需要判断dataTable是否需要更新
    if ((nextProps.tabShow === 'codes') && (this.props.tabShow !== nextProps.tabShow)) {
      this.setState({
        dataTable: this._getDataTable(nextProps),
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    return (nextState.changes !== this.state.changes)
      || (nextState.dataTable !== this.state.dataTable)
      || (nextState.codesTabShow !== this.state.codesTabShow)
      || (nextState.templateShow !== this.state.templateShow)
      || (nextProps.height !== this.props.height)
      || (nextProps.dataSource.dataTypeDomains !== this.props.dataSource.dataTypeDomains);
  }
  _codesTabClick = (code) => {
    this.setState({
      codesTabShow: code,
    });
  };
  _templateTabClick = (template) => {
    this.setState({
      templateShow: template,
    });
  };
  _copyClick = (data) => {
    Com.Message.success({title: '代码经成功复制到粘贴板'});
  };
  _getTableCode = (code, templateShow) => {
    const { changes = [], oldDataSource, dataTable } = this.state;
    const { dataSource, module } = this.props;
    // 根据模板类型的不同，传递不同的变化数据
    let tempChanges = changes.filter((c) => {
      const title = c.name.split('.')[0];
      return (templateShow === 'createFieldTemplate'
        && c.type === 'field'
        && c.opt === 'add'
        && title === dataTable.title) ||
        (templateShow === 'updateFieldTemplate'
          && c.type === 'field'
          && c.opt === 'update'
          && title === dataTable.title) ||
        (templateShow === 'deleteFieldTemplate'
          && c.type === 'field'
          && c.opt === 'delete'
          && title === dataTable.title) ||
        (templateShow === 'deleteIndexTemplate'
          && c.type === 'index'
          && c.opt === 'delete'
          && title === dataTable.title) ||
        (templateShow === 'rebuildTableTemplate'
          && c.type === 'field'
          && title === dataTable.title);
    });
    return getCodeByDataTable(dataSource, module, dataTable,
      code, templateShow, tempChanges, oldDataSource);
  };
  _getChanges = (props) => {
    const split = process.platform === 'win32' ? '\\' : '/';
    getCurrentVersionData(props.dataSource, props.project, split, (changes, oldDataSource) => {
      this.setState({
        changes,
        oldDataSource,
      });
    });
  };
  _getDataTable = (props) => {
    const { getDataTable } = props;
    return getDataTable && getDataTable();
  };
  render() {
    const { codesTabShow, templateShow } = this.state;
    const { prefix = 'pdman', dataSource, height } = this.props;
    const database = _object.get(dataSource, 'dataTypeDomains.database', []);
    const currentCode = codesTabShow || (database[0] && database[0].code) || '';
    return (
      <React.Fragment>
        <div className={`${prefix}-data-table-content-tab-code`}>
          {
            // 根据数据库的数量来生成数据类型
            database.map(db => (
              <div
                key={`${db.code}`}
                onClick={() => this._codesTabClick(db.code)}
                className={`${prefix}-data-table-content-tab${currentCode === db.code ? '-selected' : '-unselected'}`}
              >{db.code}
              </div>
            ))
          }
        </div>
        <div style={{height: height - 184, overflow: 'auto'}}>
          {
            database.map(db => (
              <div
                key={`${db.code}-code`}
                style={{display: currentCode === db.code ? '' : 'none'}}
              >
                <div
                  className={`${prefix}-data-table-content-tab`}
                  style={{marginTop: 5, fontSize: 12, marginBottom: 0}}
                >
                  <div
                    onClick={() => this._templateTabClick('createTableTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'createTableTemplate' ? '-selected' : '-unselected'}`}
                  >
                    新建数据表代码
                  </div>
                  <div
                    onClick={() => this._templateTabClick('deleteTableTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'deleteTableTemplate' ? '-selected' : '-unselected'}`}
                  >
                    删除数据表代码
                  </div>
                  <div
                    onClick={() => this._templateTabClick('createIndexTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'createIndexTemplate' ? '-selected' : '-unselected'}`}
                  >
                    新建索引代码
                  </div>
                  <div
                    onClick={() => this._templateTabClick('rebuildTableTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'rebuildTableTemplate' ? '-selected' : '-unselected'}`}
                  >
                    重建数据表代码
                  </div>
                  <div
                    onClick={() => this._templateTabClick('createFieldTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'createFieldTemplate' ? '-selected' : '-unselected'}`}
                  >
                    新增字段代码
                  </div>
                  <div
                    onClick={() => this._templateTabClick('deleteFieldTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'deleteFieldTemplate' ? '-selected' : '-unselected'}`}
                  >
                    删除字段代码
                  </div>

                  <div
                    onClick={() => this._templateTabClick('updateFieldTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'updateFieldTemplate' ? '-selected' : '-unselected'}`}
                  >
                    修改字段代码
                  </div>

                  <div
                    onClick={() => this._templateTabClick('deleteIndexTemplate')}
                    className={`${prefix}-data-table-content-tab${templateShow === 'deleteIndexTemplate' ? '-selected' : '-unselected'}`}
                  >
                    删除索引代码
                  </div>
                </div>
                <div className={`${prefix}-data-tab-content`}>
                  <div style={{display: 'flex', padding: 5}}>
                    <Com.Icon
                      type='copy1'
                      style={{cursor: 'pointer'}}
                      title='点击复制到粘贴板'
                      onClick={() => this._copyClick(
                        this._getTableCode(currentCode, templateShow))}
                    />
                    <span
                      style={{marginLeft: '10px', fontSize: 12, color: 'green'}}
                    >
                      {
                        (templateShow === 'createTableTemplate' ||
                          templateShow === 'deleteTableTemplate' ||
                          templateShow === 'createIndexTemplate') ? '该脚本为全量脚本' : '该脚本为差异化脚本'
                      }
                    </span>
                  </div>
                  <div style={{height: height - 242, overflow: 'auto'}}>
                    <Com.Code
                      language={db.code !== 'Java' ? 'SQL' : 'Java'}
                      style={{minHeight: height - 242, width: '100%'}}
                      data={this._getTableCode(db.code, templateShow)}
                    />
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </React.Fragment>
    );
  }
}
