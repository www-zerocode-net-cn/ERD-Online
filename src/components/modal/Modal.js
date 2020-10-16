import React from 'react';
import ReactDom from 'react-dom';

import { Icon } from 'antd';

import './style/index.less';

import Button from '../button/Button';
import * as utils from './utils';

class Modal extends React.Component {
  static error = utils.error;
  static success = utils.success;
  static confirm = utils.confirm;
  componentDidMount(){
    const { autoFocus } = this.props;
    this.dom = ReactDom.findDOMNode(this.instance);
    autoFocus && this.dom.focus();
    this.dom.style.zIndex = 998;
    const react = this.dom.getBoundingClientRect();
    this.defaultLeft = react.left;
    document.onmouseup = () => {
      this.dom.onmousemove = null;
    };
  }
  _onClickOk = () => {
    const { onOk } = this.props;
    onOk && onOk();
  };

  _onClickCancel = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  };

  _getDefaultButton = () => {
    const { footer } = this.props;
    if (footer !== undefined) {
      return footer;
    }
    return [<Button key="ok" onClick={this._onClickOk} type="primary">确定</Button>,
      <Button key="cancel" onClick={this._onClickCancel} style={{ marginLeft: 10 }}>取消</Button>];
  };
  _onMouseDown = (event) => {
    const { fullScreen } = this.props;
    if (!fullScreen) {
      this.moveUp = false;
      const downX = event.clientX;
      const downY = event.clientY;
      const react = this.dom.getBoundingClientRect();
      const offX = parseFloat(react.left) || 0;
      const offY = parseFloat(react.top) || 0;
      this.dom.onmousemove = (e) => {
        if (!this.moveUp) {
          this.dom.style.left =
            offX - this.defaultLeft + (e.clientX - downX) < -react.width - 50 ?
              `${-react.width - 50}px` :
              `${offX - this.defaultLeft + (e.clientX - downX)}px`;
          this.dom.style.top =  offY + (e.clientY - downY) < 20 ? '20px' : `${offY + (e.clientY - downY)}px`;
        } else {
          this.dom.onmousemove = null;
        }
      };
    }
  };
  _onMouseUp = () => {
    const { fullScreen } = this.props;
    if (!fullScreen) {
      this.moveUp = true;
    }
  };
  _onHeaderClick = () => {
    this.dom.focus();
  };
  _onFocus = () => {
    if (this.dom) {
      this.dom.style.zIndex = 998;
    }
  };
  _onBlur = () => {
    if (this.dom) {
      this.dom.style.zIndex = 997;
    }
  };
  _onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this._onClickOk();
    } else if (e.keyCode === 27) {
      this._onClickCancel();
    }
  };
  render() {
    const { children, title, visible, footer, prefix = 'pdman', width, modality, zIndex, customerIcon, fullScreen } = this.props;
    const fullScreenStyle = fullScreen ? {
      top: 0,
      height: '100%',
      width: '100%',
    } : {};
    const fullScreenBodyStyle = fullScreen ? {
      height: '100%',
      justifyContent: 'space-between',
    } : {};
    const style = modality ? {} : {
      overflow: 'auto',
      display: visible ? '' : 'none',
      position: 'fixed',
      top: 0,
      right: 0,
      left: 0,
      bottom: 0,
      zIndex: zIndex || 998,
      height: '100%',
      width: '100%',
      backgroundColor: 'rgba(55, 55, 55, 0.6)',
    };
    return (<div
      style={style}
    >
      <div
        onBlur={this._onBlur}
        onFocus={this._onFocus}
        onKeyDown={this._onKeyDown}
        tabIndex="0"
        ref={instance => this.instance = instance}
        id="modal"
        style={{
          border: '1px solid #0784DE',
          display: 'flex',
          flexDirection: 'column',
          // borderRadius: 5,
          width: width || '80%',
          position: modality ? 'fixed' : 'relative',
          margin: `0 ${modality ? '10%' : 'auto'}`,
          top: '15%',
          background: '#FFFFFF',
          boxShadow: '0 0 5px 0 #888888',
          outline: 'none',
          ...fullScreenStyle,
        }}
      >
        <div
          onClick={this._onHeaderClick}
          onMouseDown={this._onMouseDown}
          onMouseUp={this._onMouseUp}
          className={`${prefix}-modal-header`}
          id="modal-header"
          style={{
            //background: '#FFFFFF',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <span className='pdman-modal-header-context'>
            {
              !customerIcon && (
                <div className='pdman-modal-header-left-icon'>
                  {}
                </div>
              )
            }
            {title}
          </span>
          <Icon
            onClick={this._onClickCancel}
            type="close"
            style={{lineHeight: '31px', width: 31, display: fullScreen ? 'none' : ''}}
          />
        </div>
        <div
          style={{
            margin: '0 10px 10px 10px',
            //border: '1px solid #5A6672',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#F2F2F2',
            ...fullScreenBodyStyle,
          }}
        >
          <div
            style={{
              marginTop: 10,
              display: 'flex',
              flexDirection: 'column',
              height: 'calc(100% - 20px)',
            }}
          >
            {children}
          </div>
          <div
            id="modal-footer"
            style={{
              paddingTop: footer === undefined ? 10 : 0,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              minHeight: 30,
            }}
          >
            {this._getDefaultButton()}
          </div>
        </div>
      </div>
    </div>);
  }
}

export default Modal;
