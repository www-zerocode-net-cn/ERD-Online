import React from 'react';
import _object from 'lodash/object';
import PropTypes from 'prop-types';
import * as Utils from './TableUtils';
import { uuid } from '../../../utils/uuid';
import * as Com from '../../../components';

import TableDataCode from './TableDataCode';
import TableIndexConfig from './TableIndexConfig';
import TableSummary from './TableSummary';
import Table from './Table';

import './style/index.less';

const { Icon, Modal } = Com;
// 数据表详情界面
class DataTable extends React.Component {
  static Utils = Utils;

  constructor(props) {
    super(props);
    // 初始化数据表数据
    const values = props.value.split('&');
    this.currentTable = values[2];
    this.state = {
      dataTable: this._initTableData(this.props.dataSource || {}, values[1], values[2]),
      tabShow: 'summary',
      module: values[1],
      table: values[2],
    };
  }
  componentWillReceiveProps(nextProps){
    // 如果该数据表发生了变化则将变化后的数据记录下来
    if (this.props.dataSource !== nextProps.dataSource) {
      // 此处界面渲染增加当前数据表判断，如果是当前数据表发生变化则需要更新
      const { module, table } = this.state;
      const newTableData = this._initTableData(nextProps.dataSource, module, table);
      if (nextProps.changeDataType === 'reset') {
        // 如果是整体数据全部重置，那么所有的数据表都需要更新
        this.setState({
          dataTable: newTableData,
        });
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    // 表数据有变化
    // 数据类型和数据库有变化
    return (nextState.dataTable !== this.state.dataTable)
      || (nextState.tabShow !== this.state.tabShow)
      || (nextProps.height !== this.props.height)
      || (nextProps.dataSource.dataTypeDomains !== this.props.dataSource.dataTypeDomains);
  }
  promiseSave = (callback) => {
    return new Promise((res, rej) => {
      this.save((err) => {
        callback && callback(err);
        if (err) {
          rej(err);
        } else {
          res();
        }
      });
    });
  };
  save = (cb) => {
    const { dataSource } = this.props;
    const dataTable = this._getAllTableData();
    const { title } = dataTable;
    const { module, table } = this.state;
    // 增加校验表名重复的问题
    const tables = this._getAllTable(dataSource);
    if (title !== table && tables.includes(title)) {
      Modal.error({title: '保存失败', message: `数据表【${title}】已经存在了`, width: 300});
    } else if (!title) {
      if (cb) {
        cb(`数据表【${this.currentTable}】代码不能为空`);
      } else {
        Modal.error({title: '保存失败', message: `数据表【${this.currentTable}】代码不能为空`, width: 300});
      }
    } else {
      const currTable = this._deleteKey(dataTable);
      if (title.includes('/') || title.includes('&') || title.includes(':')) {
        Modal.error({title: '保存失败', message: '数据表名不能包含/或者&或者:', width: 300});
        cb('error');
      } else if (currTable.fields && currTable.fields
        .some(filed => filed.name.includes('/') || filed.name.includes('&') || filed.name.includes(':'))) {
        Modal.error({title: '保存失败', message: '属性名不能包含/或者&或者:', width: 300});
        cb('error');
      } else {
        const { project, saveProjectSome, updateTabs } = this.props;
        saveProjectSome(`${project}.pdman.json`, currTable, () => {
            if (title !== table) {
              // 如果修改了表名修改更新tab信息
              updateTabs && updateTabs(module, table, title);
            }
            cb();
          }, title !== table && {oldName: table, newName: title},
          `${module}/entities/${table}`);
      }
    }
  };
  _getAllTable = (dataSource) => {
    return (dataSource.modules || []).reduce((a, b) => {
      return a.concat((b.entities || []).map(entity => entity.title));
    }, []);
  };
  _initColumnOrder = (dataTable) => {
    // 初始化列的顺序、列在关系图中的显示
    // 返回原引用，否则会影响后续的引用比较
    const tempDataTable = dataTable;
    const { columnOrder } = this.props;
    const headers = (dataTable && dataTable.headers || []);
    const headerNames = headers.map(header => header.fieldName);
    // 1.获取当前表的列，检查是否完整并补充
    columnOrder.forEach((column) => {
      if (!headerNames.includes(column.code)) {
        headers.push({
          fieldName: column.code,
          relationNoShow: column.relationNoShow,
        });
      }
    });
    if (tempDataTable) {
      tempDataTable.headers = headers;
    }
    return tempDataTable;
  };
  _deleteKey = (dataTable) => {
    const tempFields = (dataTable.fields || []).map(field => _object.omit(field, ['key']));
    return {
      ...dataTable,
      fields: tempFields,
      indexs: (dataTable.indexs || []).map((field) => {
        return {
          ..._object.omit(field, ['key']),
          fields: (field.fields || []).filter(f => tempFields.map(fd => fd.name).includes(f)),
        };
      }).filter(indexData => (indexData.fields || []).length > 0),
    };
  };
  _initTableData = (dataSource, module, table) => {
    const moduleData = {...(dataSource.modules || []).filter(mo => mo.name === module)[0] || {}};
    const tableData = {...(moduleData.entities || [])
        .filter(entity => entity.title === table)[0] || {}};
    const fields = (tableData.fields || []).map(field => ({...field, key: `${uuid()}-${field.name}`}));
    const indexs = (tableData.indexs || []).map(field => ({...field, key: `${uuid()}-${field.name}`}));
    tableData.fields = fields;
    tableData.indexs = indexs;
    return this._initColumnOrder(tableData);
  };
  _tabClick = (type) => {
    this.setState({
      tabShow: type,
    });
  };
  _getDataTable = () => {
    const { dataTable } = this.state;
    return (this.tableInstance && this.tableInstance.getData()) || dataTable;
  };
  _getAllTableData = () => {
    const { dataTable } = this.state;
    const summary = (this.tableSummaryInstance && this.tableSummaryInstance.getSummaryData()) || {};
    const table = this._getDataTable();
    const indexsDate = (this.indexConfigInstance && this.indexConfigInstance.getData())
      || (dataTable.indexs || []);
    return {
      ...dataTable,
      ...table,
      ...summary,
      indexs: indexsDate,
    };
  };
  render() {
    const { dataTable = {} } = this.state;
    const { prefix = 'pdman', height, dataSource, columnOrder } = this.props;
    const { module, table } = this.state;
    const dataTypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    return (<div className={`${prefix}-data-table`}>
      <div className={`${prefix}-data-table-title`}>
        <Icon type="fa-table" style={{marginRight: 5}}/>
        {`${module}/${table}/数据表详情`}
      </div>
      <div
        className={`${prefix}-data-table-content`}
      >
        <div className={`${prefix}-data-table-content-tab`}>
          <div
            onClick={() => this._tabClick('summary')}
            className={`${prefix}-data-table-content-tab${this.state.tabShow === 'summary' ? '-selected' : '-unselected'}`}
          >基本信息
          </div>
          <div
            onClick={() => this._tabClick('fields')}
            className={`${prefix}-data-table-content-tab${this.state.tabShow === 'fields' ? '-selected' : '-unselected'}`}
          >字段信息
          </div>
          <div
            onClick={() => this._tabClick('codes')}
            className={`${prefix}-data-table-content-tab${this.state.tabShow === 'codes' ? '-selected' : '-unselected'}`}
          >代码信息
          </div>
          <div
            onClick={() => this._tabClick('indexs')}
            className={`${prefix}-data-table-content-tab${this.state.tabShow === 'indexs' ? '-selected' : '-unselected'}`}
          >索引信息
          </div>
        </div>
        <div style={{height: height - 145, overflow: 'auto'}}>
          <div
            className={`${prefix}-data-table-content-summary`}
            style={{display: this.state.tabShow === 'summary' ? '' : 'none'}}
          >
            <TableSummary
              dataTable={this.state.dataTable}
              ref={instance => this.tableSummaryInstance = instance}
            />
          </div>
          <div style={{display: this.state.tabShow === 'fields' ? '' : 'none'}}>
            <Table
              height={height}
              columnOrder={columnOrder}
              dataTable={dataTable}
              dataSource={dataSource}
              dataTypes={dataTypes}
              ref={instance => this.tableInstance = instance}
            />
          </div>
          <div style={{display: this.state.tabShow === 'codes' ? '' : 'none'}}>
            <TableDataCode
              tabShow={this.state.tabShow}
              height={height}
              dataSource={dataSource}
              project={this.props.project}
              getDataTable={this._getDataTable}
              module={module}
            />
          </div>
          <div style={{display: this.state.tabShow === 'indexs' ? '' : 'none', height: '100%'}}>
            <TableIndexConfig
              height={height}
              ref={instance => this.indexConfigInstance = instance}
              getDataTable={this._getDataTable}
              tabShow={this.state.tabShow}
            />
          </div>
        </div>
      </div>
    </div>);
  }
}
DataTable.contextTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
};

export default DataTable;

