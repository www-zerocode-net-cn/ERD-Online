import React from 'react';

import {Button, Modal} from '../components';

import './style/javHome.less';

const { execFile } = require('child_process');


export default class JavaHomeConfig extends React.Component {
  constructor(props){
    super(props);
    this.split = process.platform === 'win32' ? '\\' : '/';
    this.state = {
      data: {
        JAVA_HOME: props.data.JAVA_HOME || process.env.JAVA_HOME || process.env.JER_HOME || '',
        DB_DRIVE: props.data.DB_DRIVE || [],
      },
    };
  }
  _arr2str = (arr) => {
    const utf8 = Array.from(arr).map((item) => {
      return String.fromCharCode(item);
    }).join('');
    return decodeURIComponent(escape(utf8));
  };
  _execFile = () => {
    const { data } = this.state;
    const value = data.JAVA_HOME;
    const tempValue = value ? `${value}${this.split}bin${this.split}java` : 'java';
    execFile(tempValue, ['-version'], (error, stdout, stderr) => {
      if (error) {
        Modal.error({title: '配置失败', message: stderr});
      } else {
        Modal.success({
          title: '配置成功',
          message: <div>JAVA_HOME配置正确<br/>{stderr}</div>,
          width: 300,
        });
      }
    });
  };
  _openDir = (callBack, type) => {
    const properties = type === 'JAVA_HOME' ? 'openDirectory' : 'multiSelections';
    const filter = type === 'JAVA_HOME' ? [] : [{name: 'jar', extensions: ['jar']}];
  };
  _iconClick = (type) => {
    const { onChange } = this.props;
    this._openDir((dir) => {
      this.setState({
        data: {
          ...this.state.data,
          [type]: dir,
        },
      }, () => {
        onChange && onChange(this.state.data);
      });
    }, type);
  };
  _onChange = (e, type) => {
    const { onChange } = this.props;
    this.setState({
      data: {
        ...this.state.data,
        [type]: e.target.value,
      },
    }, () => {
      onChange && onChange(this.state.data);
    });
  };
  _connectJDBC = () => {
    //const { project } = this.props;
    const { data } = this.state;
    const value = data.JAVA_HOME;
    const defaultPath = '';
    const jar = data.DB_CONNECTOR || defaultPath;
    const tempValue = value ? `${value}${this.split}bin${this.split}java` : 'java';
    execFile(tempValue,
      [
        '-jar', jar,
      ],
      (error, stdout, stderr) => {
        if (error) {
          Modal.error({title: '连接失败', message: stderr});
        } else {
          Modal.success({title: '连接成功', message: stdout});
        }
    });
  };
  render() {
    const { data = {} } = this.state;
    return (<div className='pdman-config-java'>
      <div className='pdman-config-java-config'>
        <div className='pdman-config-java-config-label'>
          <span>JAVA_HOME:</span>
        </div>
        <div className='pdman-config-java-config-input'>
          <input
            onChange={e => this._onChange(e, 'JAVA_HOME')}
            value={data.JAVA_HOME}
          />
        </div>
        <div className='pdman-config-java-config-button'>
          <Button onClick={() => this._iconClick('JAVA_HOME')} title='点击选择JAVA_HOME'>...</Button>
          <Button style={{marginLeft: 5}} onClick={this._execFile}>测试</Button>
        </div>
      </div>
    </div>);
  }
}
