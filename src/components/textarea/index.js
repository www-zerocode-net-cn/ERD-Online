import React from 'react';

import './style/index.less';

export default class TextArea extends React.Component{
  _onChange = (e) => {
    const { onChange, validate } = this.props;
    onChange && onChange({
      ...e,
      target: {
        ...e.target,
        value: e.target.value.trim(),
      },
    });
    const result = validate && validate();
    this.setState({
      result,
    });
  };
  _onBlur = (e) => {
    const { onBlur } = this.props;
    onBlur && onBlur(e);
  };
  _onDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  _onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation();
    }
  };
  render() {
    const { prefix = 'pdman', style, defaultValue, wrapperStyle, value, readOnly, placeholder } = this.props;
    return (<div className={`${prefix}-textarea-wrapper`} style={wrapperStyle}>
      <textarea
        onKeyDown={e => this._onKeyDown(e)}
        onDragStart={this._onDragStart}
        onBlur={this._onBlur}
        className={`${prefix}-textarea`}
        onChange={this._onChange}
        style={style}
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
      />
      <span className={`${prefix}-textarea-validate`}>{this.state && this.state.result}</span>
    </div>);
  }
}
