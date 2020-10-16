import React from 'react';

export default class Text extends React.Component{
  render(){
    const { value } = this.props;
    return (<span title={value} style={{textAlign: 'center'}}>{value}</span>);
  }
}
