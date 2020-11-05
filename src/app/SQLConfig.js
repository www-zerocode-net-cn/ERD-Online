import React from 'react';

import { Input } from '../components';

export default class SQLConfig extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      separator: props.data || '/*SQL@Run*/',
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
        className='pdman-sql-config'
      >
        <span style={{width: 100}}>SQL分隔符：</span>
        <Input value={separator} placeholder='默认为“/*SQL@Run*/”' onChange={this._separatorChange}/>
      </div>
    );
  }
}
