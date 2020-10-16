import React from 'react';
import { Select, Modal } from '../../../components';

import './style/index.less';

export default class RelationEdit extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      from: props.from,
      to: props.to,
    };
  }
  _valueChange = (e, type) => {
    this.setState({
      [type]: e.target.value,
    });
  };
  save = (callBack) => {
    const { from, to } = this.state;
    if (!from || !to) {
      Modal.error({title: '编辑失败', message: '对应关系不能为空', width: 300});
    } else {
      callBack && callBack(null, `${from}:${to}`);
    }
  };
  render() {
    const { from, to } = this.state;
    const { prefix = 'pdman' } = this.props;
    return (<div className={`${prefix}-relation-edit`}>
      <span>from</span>
      <Select
        style={{width: 100}}
        value={from}
        onChange={e => this._valueChange(e, 'from')}>
        <option value='1' key='1'>1</option>
        <option value='0,1' key='0,1'>0,1</option>
        <option value='0,n' key='0,n'>0,n</option>
        <option value='1,n' key='1,n'>1,n</option>
        <option value='' key='__empty'>请选择</option>
      </Select>
      <span>:</span>
      <span>to</span>
      <Select
        style={{width: 100}}
        value={to}
        onChange={e => this._valueChange(e, 'to')}>
        <option value='0' key='0'>0</option>
        <option value='1' key='1'>1</option>
        <option value='0,1' key='0,1'>0,1</option>
        <option value='0,n' key='0,n'>0,n</option>
        <option value='1,n' key='1,n'>1,n</option>
        <option value='' key='__empty'>请选择</option>
      </Select>
    </div>);
  }
}
