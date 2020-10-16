import React from 'react';

import './style/index.less';
import { uuid } from '../../utils/uuid';

export default class Radio extends React.Component{
  _onChange = () => {
    const { onChange, value } = this.props;
    onChange && onChange(value);
  };
  _onBlur = (e) => {
    const { onBlur } = this.props;
    onBlur && onBlur(e);
  };
  _onClick = (e) => {
    e.stopPropagation();
    const { onClick } = this.props;
    onClick && onClick(e);
  };
  _onDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  render(){
    const { prefix = 'pdman',
      style, wrapperStyle, groupValue, value,
      title, disabled = false, children, name = uuid(), radioStyle = {} } = this.props;
    return (
      <div style={{display: 'flex', ...radioStyle}}>
        <div
          className={`${prefix}-radio-wrapper`}
          style={wrapperStyle}
        >
          <input
            disabled={disabled}
            draggable
            onDragStart={this._onDragStart}
            type="radio"
            onBlur={this._onBlur}
            className={`${prefix}-radio`}
            onChange={this._onChange}
            style={style}
            onClick={this._onClick}
            checked={groupValue === value}
            title={title}
            name={name}
          />
        </div>
        {children}
      </div>);
  }
}
