import React from 'react';
import './style/header.less';


export default class Header extends React.Component{
  render() {
    const { projectName } = this.props;
    return (<div style={{background: '#ffffff'}}>
      <div className='erd-top-border' onDoubleClick={this._onDbClick}>{}</div>
      <div className='erd-header'>
        <div className='erd-header-left'>
          <div className='erd-header-left-icon'>
            {}
          </div>
          {/*<Icon type='roic-erd' style={{color: '#3091E3'}}/>*/}
          <div className='erd-header-left-project'>
            {projectName || '无打开的项目'}
          </div>
          <div className='erd-header-left-app'>
            &nbsp;-&nbsp;ERD-ONLINE
          </div>
        </div>
        <div className='erd-header-right'>
          {}
        </div>
      </div>
    </div>);
  }
}
