import React from 'react';
import AceEditor from 'react-ace';

import 'brace/mode/mysql';
import 'brace/mode/java';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import { uuid } from '../../utils/uuid';

export default class Editor extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: uuid(),
    };
  }
  onLoad = (ace) => {
    const { focus, firstLine } = this.props;
    focus && ace.focus();
    firstLine && ace.selection.moveCursorTo(0, 0);
  };
  _onChange = (value) => {
    const { onChange } = this.props;
    onChange && onChange({
      target: {
        value,
      },
    });
  };
  _onKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.stopPropagation();
    }
  };
  render() {
    const { name } = this.state;
    const { mode = 'mysql', theme = 'monokai', value, height, width } = this.props;
    return (
      <div onKeyDown={this._onKeyDown}>
        <AceEditor
          fontSize={14}
          height={height}
          width={width}
          mode={mode}
          theme={theme}
          name={name}
          onChange={this._onChange}
          value={value}
          enableBasicAutocompletion
          enableLiveAutocompletion
          onLoad={this.onLoad}
        />
      </div>
    );
  }
}
