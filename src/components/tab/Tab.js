/* eslint-disable */
import React from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import Icon from '../icon';

import TabPane from './TabPane';
// import _object from 'lodash/object';

import './style/index.less';
import { addOnResize } from '../../utils/listener';
import defaultConfig from '../../profile';

class Tab extends React.Component {

  static TabPane = TabPane;
  static defaultProps = {
    headerPosition: 'top',
    type: 'edit'
  };
  constructor(props) {
    super(props);
    this.state = {
      key: props.defaultShow,
      defaultSelectColor: '#CDDDF6',
      defaultColor: '#E3E3E5',
      hrColor: '#CDCDCD',
      border: '2px solid #58A1F3',
    };
    this.flag = true;
  }
  getChildContext(){
    return {
      height: this.state.height || document.body.clientHeight - defaultConfig.menuHeight - 20,
      width: document.body.clientWidth - this.props.leftTabWidth
    }
  }
  componentDidMount(){
    this.dom = ReactDom.findDOMNode(this.instance);
    addOnResize(this._setTabsHeight);
  }
  componentWillUnmount(){
    this.flag = false;
  }
  _setTabsHeight = () => {
    this.flag && this.setState({
      height: document.body.clientHeight - defaultConfig.menuHeight - 20,
    });
  };
  _titleClick = (key) => {
    const { onClick } = this.props;
    this.setState({
      key,
      showDropMenu: false
    });
    onClick && onClick(key);
  };

  _iconCloseClick = (e, key) => {
    e.stopPropagation();
    const { onClose } = this.props;
    onClose && onClose(key);
  };

  _titleDoubleClick = (key) => {
    const { onDoubleClick } = this.props;
    onDoubleClick && onDoubleClick(key);
  };

  _getShowKey = () => {
    const { show } = this.props;
    const { defaultShow } = this.state;
    if (show) {
      return show;
    }
    return defaultShow;
  };
  _showDropMenu = () => {
    this.setState({
      showDropMenu: !this.state.showDropMenu
    }, () => {
      if (this.state.showDropMenu) {
        this.dom.focus();
      }
    })
  };
  _onBlur = () => {
    this.setState({
      showDropMenu: false
    })
  };
  _getTabHeader = () => {
    const { children, type, tabs = [], prefix = 'pdman' } = this.props;
    const tempTabs = tabs.filter(tab => tab.folding);
    return (<div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'row', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          {
            [].concat(children)
              .map(child => (<div
                title={child.props.realName || child.props.title}
                style={{
                  alignItems: 'center',
                  display: 'flex',
                  width: 150,
                  borderTop: child.key === this._getShowKey() ? this.state.border : 'none',
                  cursor: 'pointer',
                  userSelect: 'none',
                  justifyContent: 'space-between',
                  backgroundColor: child.key === this._getShowKey() ?
                    this.state.defaultSelectColor : this.state.defaultColor
                }}
                key={child.key}
                onClick={() => this._titleClick(child.key)}
                onDoubleClick={() => this._titleDoubleClick(child.key)}
              >
                <Icon type={child.props.icon || "file"} style={{paddingLeft: 5}}/><span
                style={{
                  display: 'inline-block',
                  width: 100,
                  marginLeft: 2.5,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >{child.props.realName || child.props.title}</span>
                {
                  type === 'edit' ? <Icon
                    onClick={(e) => this._iconCloseClick(e, child.key)}
                    style={{ marginLeft: 2.5 }}
                    type="close"
                  /> : null
                }
              </div>))
          }
        </div>
        <div
          onClick={this._showDropMenu}
          style={{width: 25, cursor: 'pointer', display: tempTabs.length > 0 ? '' : 'none'}}>
          <Icon type="fa-ellipsis-v" style={{marginRight: 2}}/>
          {
            tempTabs.length > 9 ? '9+' : tempTabs.length
          }
        </div>
        <div
          ref={instance => this.instance = instance}
          onBlur={this._onBlur}
          tabIndex="0"
          className={`${prefix}-tab-drop-menu`}
          style={{display: this.state.showDropMenu && tempTabs.length > 0 ? '' : 'none' }}>
          <ul>
            {
              tempTabs.map(tab => <li
                title={tab.title}
                key={tab.key}
                onClick={(e) => this._titleClick(tab.key)}
              ><Icon
                  type={tab.icon || 'file'}
                  style={{ marginRight: 2.5 }}
                />
                <span>{tab.title}</span>
                <Icon
                  onClick={(e) => this._iconCloseClick(e, tab.key)}
                  style={{ marginLeft: 2.5 }}
                  type="close"
                />
              </li>)
            }
          </ul>
        </div>
      </div>
      <div style={{ background: this.state.hrColor, height: 1 }} />
    </div>);
  };

  render() {
    const { children, headerPosition, leftTabWidth, dataSource } = this.props;
    return (<div style={{ display: 'flex', flexDirection: 'column' }}>
      {
        headerPosition === 'top' ? this._getTabHeader() : null
      }
      <div id="body" style={{height: `${(this.state.height ||
          document.body.clientHeight - defaultConfig.menuHeight - 20) + 10}px`, overflow: 'auto'}}>
        {
          [].concat(children).map(child => (<div
            key={child.key}
            style={{ display: child.key === this._getShowKey() ? '' : 'none', height: '100%' }}
          >
            {React.cloneElement(child, {
              dataSource,
              show: this._getShowKey(),
              id: child.key,
              height: (this.state.height || document.body.clientHeight - defaultConfig.menuHeight - 20) + 10,
              width: document.body.clientWidth - leftTabWidth
            })}
          </div>))
        }
      </div>
      {
        headerPosition === 'top' ? null : this._getTabHeader()
      }
    </div>);
  }
}

Tab.childContextTypes = {
  height: PropTypes.number,
  width: PropTypes.number
};

export default Tab;
