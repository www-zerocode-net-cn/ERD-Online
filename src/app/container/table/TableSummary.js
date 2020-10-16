import React from 'react';
import * as Com from '../../../components';

const { Input, TextArea } = Com;

// 状态维持在组件内部，当调用保存时在更新到上层组件【当前组件需要提供一个上层调用的方法来获取最新的数据】
export default class TableSummary extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dataTable: props.dataTable,
    };
  }
  componentWillReceiveProps(nextProps){
    // 如果上层的dataTable标题发生发生变化则需要以上层为主
    if (nextProps.dataTable.title !== this.state.dataTable.title) {
      this.setState({
        dataTable: {
          ...this.state.dataTable,
          title: nextProps.dataTable.title,
        },
      });
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    // 当前组件需要渲染的内容
    const tableSummaryFields = ['chnname','title','nameTemplate','remark'];
    // 循环判断组件参数是否发生变化
    return tableSummaryFields.some(f => nextState.dataTable[f] !== this.state.dataTable[f]);
  }
  getSummaryData = () => {
    // 用以直接覆盖更新上层组件的数据
    const { dataTable: { chnname, title, nameTemplate, remark } } = this.state;
    return {
      chnname,
      title,
      nameTemplate,
      remark,
    };
  };
  _saveData = (data) => {
    this.setState({
      dataTable: data,
    });
  };
  _inputTableOnChange = (e, name) => {
    const { dataTable } = this.state;
    this._saveData({
      ...dataTable,
      [name]: e.target.value,
    });
  };
  _getTableSummary = (name) => {
    const { dataTable } = this.state;
    return dataTable && dataTable[name];
  };
  render() {
    return (
      <React.Fragment>
        <div>
          <span>表名</span>
          <Input
            wrapperStyle={{width: 'calc(100% - 80px)'}}
            style={{height: 23, width: '100%'}}
            value={this._getTableSummary('chnname')}
            onChange={e => this._inputTableOnChange(e, 'chnname')}
          />
        </div>
        <div>
          <span>逻辑名</span>
          <Input
            wrapperStyle={{width: 'calc(100% - 80px)'}}
            style={{height: 23, width: '100%'}}
            value={this._getTableSummary('title')}
            onChange={e => this._inputTableOnChange(e, 'title')}
          />
        </div>
        <div>
          <span>显示方式</span>
          <Input
            wrapperStyle={{width: 'calc(100% - 80px)'}}
            style={{height: 23, width: '100%'}}
            value={this._getTableSummary('nameTemplate') || '{code}[{name}]'}
            onChange={e => this._inputTableOnChange(e, 'nameTemplate')}
          />
        </div>
        <div>
          <span>说明</span>
          <TextArea
            wrapperStyle={{width: 'calc(100% - 80px)'}}
            style={{height: 150, width: '100%'}}
            value={this._getTableSummary('remark')}
            onChange={e => this._inputTableOnChange(e, 'remark')}
          />
        </div>
      </React.Fragment>
    );
  }
}
