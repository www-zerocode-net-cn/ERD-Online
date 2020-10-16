import React from 'react';

import './style/index.less';
// 全局遮罩组件

export default class Mask extends React.Component{
  render() {
    const { visible, children } = this.props;
    return <div className='pdman-mask' style={{display: visible ? 'block' : 'none'}}>{children}</div>;
  }
}
