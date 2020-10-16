/* eslint-disable */
import React from 'react';
// import _object from 'lodash/object';

class TabPane extends React.Component {
  shouldComponentUpdate(nextProps){
    return (nextProps.height !== this.props.height ||
      nextProps.width !== this.props.width ||
      nextProps.dataSource !== this.props.dataSource);
  }
  render() {
    const { children, style } = this.props;
    return (<div
      style={{ overflow: 'auto', height: '100%', ...style }}
    >
      {React.cloneElement(children, {...this.props})}</div>);
  }
}

export default TabPane;
