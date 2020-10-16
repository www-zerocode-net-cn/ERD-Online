import React from 'react';

import * as utils from  './utils';
import './style/index.less';

export default class Message extends React.Component{
  static success = utils.success;
  static error = utils.error;
  static warning = utils.warning;
  render() {
    const { prefix = 'pdman', children, style } = this.props;
    return (<div className={`${prefix}-message`} style={{zIndex: 9999, ...style}}>
      <div className={`${prefix}-message-content`}>
        {children}
      </div>
    </div>);
  }
}
