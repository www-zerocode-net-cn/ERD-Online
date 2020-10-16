/* eslint-disable */
import React from 'react';

import './style/index.less';

class Index extends React.Component {

  _onBlur = (evt) => {
    evt.stopPropagation();
    const { onBlur } = this.props;
    onBlur && onBlur(evt);
  };
  _onChange = (evt) => {
    evt.stopPropagation();
    evt.target.blur();
    const { onChange } = this.props;
    onChange && onChange(evt);
  };
  _onDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  render() {
    const { defaultValue, prefix = 'pdman', style, children, value } = this.props;
    return (
      <select
        draggable
        onDragStart={this._onDragStart}
        className={`${prefix}-select`}
        style={style}
        defaultValue={defaultValue}
        value={value}
        onChange={this._onChange}
        onBlur={this._onBlur}
      >
        {children}
      </select>
    );
  }
}

export default Index;

