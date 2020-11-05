import React from 'react';
import './style/header.less';


export default class Header extends React.Component{
  render() {
    const { projectName } = this.props;
    return (<div style={{background: '#E3E3E5'}}>
      <div className='pdman-top-border' onDoubleClick={this._onDbClick}>{}</div>
      <div className='pdman-header'>
        <div className='pdman-header-left'>
          <div className='pdman-header-left-icon'>
            {}
          </div>
          {/*<Icon type='roic-pdman' style={{color: '#3091E3'}}/>*/}
          <div className='pdman-header-left-project'>
            {projectName || '无打开的项目'}
          </div>
          <div className='pdman-header-left-app'>
            &nbsp;-&nbsp;PDMan
          </div>
        </div>
        <div className='pdman-header-right'>
          {}
        </div>
      </div>
    </div>);
  }
}
