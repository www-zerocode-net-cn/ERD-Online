import React from 'react';

import './style/index.less';
import SimpleTabPane from './SimpleTabPane';

export default class SimpleTab extends React.Component{
  static SimpleTabPane = SimpleTabPane;
  constructor(props){
    super(props);
    this.state = {
      show: '',
    };
  }
  _tabClick = (value) => {
    this.setState({
      show: value,
    });
  };
  render(){
    const { children, prefix = 'pdman' } = this.props;
    let { show } = this.state;
    if (!show) {
      show = children[0] && children[0].props.value;
    }
    return (<div className={`${prefix}-simple-tab`}>
      <div className={`${prefix}-simple-tab-header`}>
        {children.map(child => (
          <div
            key={child.props.value}
            className={`${prefix}-simple-tab-header-tab
             ${child.props.value === show ? `${prefix}-simple-tab-header-selected`
              : `${prefix}-simple-tab-header-unselected`}`}
            onClick={() => this._tabClick(child.props.value)}
          >{child.props.name}</div>
        ))}
      </div>
      <div className={`${prefix}-simple-tab-body`}>
        {children.map((child) => {
          let style = {};
          if (child.props.value !== show) {
            style = { display: 'none' };
          }
          return (<div style={style}>{React.cloneElement(child, {show, key: child.props.value})}
          </div>);
        })}
      </div>
    </div>);
  }
}
