import React from 'react';

import { Icon } from '../components';
import './style/header.less';

export default class Header extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      flag: true,
    };
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.disableMaximize !== this.props.disableMaximize) {
      this.setState({
        flag: true,
      });
    }
  }
  _iconClick = (type) => {
    switch (type) {
      case 'minimize': break;
      case 'restore':
        this.setState({
          flag: !this.state.flag,
        });
      case 'maximize':
        this.setState({
          flag: !this.state.flag,
        });
      case 'close': break;
      default: break;
    }
  };
  _onDbClick = () => {
    const { flag } = this.state;
    const { project = '', projectDemo } = this.props;
    (project || projectDemo) && this._iconClick(flag ? 'maximize' : 'restore');
  };
  render() {
    const { flag } = this.state;
    const { disableMaximize = false, project = '', projectDemo } = this.props;
    return (<div style={{background: '#E3E3E5'}}>
      <div className='pdman-top-border' onDoubleClick={this._onDbClick}>{}</div>
      <div className='pdman-header'>
        <div className='pdman-header-left'>
          <div className='pdman-header-left-icon'>
            {}
          </div>
          {/*<Icon type='roic-pdman' style={{color: '#3091E3'}}/>*/}
          <div className='pdman-header-left-project'>
            {projectDemo ? `当前为演示项目:${projectDemo}` : project || '无打开的项目'}
          </div>
          <div className='pdman-header-left-app'>
            &nbsp;-&nbsp;PDMan
          </div>
        </div>
        <div className='pdman-header-right'>
          <Icon type='fa-window-minimize' onClick={() => this._iconClick('minimize')}/>
          <Icon
            style={{display: disableMaximize || flag ? 'none' : ''}}
            type='fa-window-restore'
            onClick={() => this._iconClick('restore')}
          />
          <Icon
            style={{display: !disableMaximize && flag ? '' : 'none'}}
            type='fa-window-maximize'
            onClick={() => this._iconClick('maximize')}
          />
          <Icon type='fa-window-close-o' onClick={() => this._iconClick('close')}/>
        </div>
      </div>
    </div>);
  }
}
