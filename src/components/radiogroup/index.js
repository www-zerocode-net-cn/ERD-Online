import React from 'react';
import { uuid } from '../../utils/uuid';

import Radio from '../radio';

export default class RadioGroup extends React.Component{
  static Radio = Radio;
  _onChange = (value) => {
    const { onChange } = this.props;
    onChange && onChange(value);
  };
  render(){
    const { children, name = uuid(), title, value, groupStyle } = this.props;
    return (<div style={{width: '100%', display: 'flex', ...groupStyle}}>
      {
        [].concat(children)
          .map(c =>
            (React.cloneElement(c,
              {key: c.props.value, onChange: this._onChange, name, groupValue: value, title})))
      }
    </div>);
  }
}
