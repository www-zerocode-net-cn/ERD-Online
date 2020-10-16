import React from 'react';

import './style/index.less';

export default class PDManIcon extends React.Component {
  shouldComponentUpdate(nextProps){
    // 阻止图标组件无意义的渲染
    return (nextProps.type !== this.props.type)
      || (nextProps.className !== this.props.className)
      || (nextProps.style !== this.props.style)
      || (nextProps.onClick !== this.props.onClick);
  }
  render() {
    const { type, className } = this.props;
    if (type.startsWith('roic-') || type.startsWith('roic_')) {
      const roicProps = {
        ...this.props,
        className: `icon roic ${type} ${className || ''} ro-icon`,
      };
      return (<i {...roicProps}>{}</i>);
    } else if (type.startsWith('fa-')) {
      const faProps = {
        ...this.props,
        className: `fa ${type} ${className || ''} ro-icon`,
      };
      return (<i {...faProps}>{}</i>);
    }
    const faProps = {
      ...this.props,
      className: `icon anticon icon-${type} ${className || ''}`,
    };
    return (<i {...faProps}>{}</i>);
  }
}
