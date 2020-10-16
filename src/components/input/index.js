import React from 'react';
import ReactDom from 'react-dom';

import './style/index.less';


export default class Input extends React.Component{
  componentDidMount(){
    this.input = ReactDom.findDOMNode(this.instance);
  }
  select = () => {
    this.input && this.input.select();
    this.selectFlag = true;
  };
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
  fixControlledValue = (value) => {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  };
  _onSelect = (e) => {
    // 通过上下移动来获取焦点
    this.selectFlag && e.target.select();
    // 触发上层的获取焦点方法
    const { onFocus } = this.props;
    onFocus && onFocus();
    this.selectFlag = false;
  };
  _onKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 88) {
      // 将输入框的值转化成数组
      const camel = (str, firstUpper) => {
        let ret = str.toLowerCase();
        ret = ret.replace(/_([\w+])/g, (all, letter) => {
          return letter.toUpperCase();
        });
        if(firstUpper){
          ret = ret.replace(/\b(\w)(\w*)/g, ($0, $1, $2) => {
            return $1.toUpperCase() + $2;
          });
        }
        return ret;
      };
      const underline = (str, upper) => {
        const ret = str.replace(/([A-Z])/g, '_$1');
        if (upper) {
          return ret.toUpperCase();
        }
        return ret.toLowerCase();
      };
      const values = Array.from(this.input.value);
      const start = this.input.selectionStart;
      const end = this.input.selectionEnd;
      const updateValues = values.slice(start, end);
      const defaultValues = values.splice(0, start);
      // 如果选中的是全大写
      if (updateValues.every(v => v.toLocaleUpperCase() === v)) {
        this.input.value = defaultValues.join('') + camel(updateValues.join(''), false);
      } else {
        this.input.value = defaultValues.join('') + underline(updateValues.join(''), true);
      }
      const { onChange } = this.props;
      onChange && onChange({
        ...e,
        target: {
          ...e.target,
          value: this.input.value.trim(),
        },
      });
    }
  };
  render() {
    const otherProps = {...this.props};
    if ('value' in otherProps) {
      otherProps.value = this.fixControlledValue(otherProps.value);
      delete otherProps.defaultValue;
    }
    const { prefix = 'pdman', style, defaultValue, wrapperStyle, value, autoFocus, suffix, placeholder, disabled } = otherProps;
    return (<div className={`${prefix}-input-wrapper`}  style={wrapperStyle}>
      <input
        onKeyDown={e => this._onKeyDown(e)}
        placeholder={placeholder}
        ref={instance => this.instance = instance}
        autoFocus={autoFocus}
        draggable
        onDragStart={this._onDragStart}
        onBlur={this._onBlur}
        className={`${prefix}-input`}
        onChange={this._onChange}
        style={{...style, float: suffix ? 'left' : 'inherit'}}
        defaultValue={defaultValue}
        value={value}
        onSelect={this._onSelect}
        disabled={disabled}
      />
      {suffix && React.cloneElement(suffix, {className: `${prefix}-input-suffix`})}
      <span className={`${prefix}-input-validate`}>{this.state && this.state.result}</span>
    </div>);
  }
}
