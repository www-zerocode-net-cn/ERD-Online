import React from 'react';

export default class SimpleTabPane extends React.Component{
  shouldComponentUpdate(){
    return false;
  }
  render(){
    const { children } = this.props;
    return (<div>{children}</div>);
  }
}
