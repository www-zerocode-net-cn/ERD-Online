import React from 'react';

import { Input } from '../components';

export default class SQLConfig extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      separator: props.data || ';',
    };
  }
  _separatorChange = (e) => {
    const { onChange } = this.props;
    this.setState({
      separator: e.target.value,
    }, () => {
      onChange && onChange(this.state.separator);
    });
  };
  render(){
    const { separator } = this.state;
    return (
      <div
        style={{
          border: '1px solid #ADADAD',
          padding: '5px',
          display: 'flex',
        }}
      >
        <span style={{width: 100}}>SQL分隔符：</span>
        <Input value={separator} placeholder='默认为“;”' onChange={this._separatorChange}/>
      </div>
    );
  }
}
