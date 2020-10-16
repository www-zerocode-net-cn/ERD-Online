import React from 'react';

import { Button, Message } from '../components';
import { copyFileSync } from '../utils/json';
import './style/word.less';



export default class WORDConfig extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
    };
  }
  _openDir = (callBack) => {
    const filter = [{name: 'word模板文件', extensions: ['docx']}];
  };
  _iconClick = () => {
    const { onChange } = this.props;
    this._openDir((dir) => {
      this.setState({
        data: dir,
      }, () => {
        onChange && onChange(this.state.data);
      });
    });
  };
  _saveTemplate = () => {
    // 获取word的目录
    const defaultPath = '';
  };
  _onChange = (e) => {
    const { onChange } = this.props;
    this.setState({
      data: e.target.value,
    }, () => {
      onChange && onChange(this.state.data);
    });
  };
  render() {
    const { data } = this.state;
    return (
      <div className='pdman-config-word'>
        <div className='pdman-config-word-config'>
          <div className='pdman-config-word-config-label'>
            <span>WORD模板:</span>
          </div>
          <div className='pdman-config-word-config-input'>
            <input
              placeholder='默认为系统自带的模板，如需修改，请先另存为，再指定模板文件'
              onChange={this._onChange}
              value={data || ''}
            />
          </div>
          <div className='pdman-config-word-config-button'>
            <Button onClick={this._iconClick} title='点击从本地选择模板'>...</Button>
            <Button style={{marginLeft: 5}} onClick={this._saveTemplate}>模板另存为</Button>
          </div>
        </div>
      </div>
    );
  }
}
