/* eslint-disable */
import React from 'react';
import ReactDom from 'react-dom';
import _ from 'lodash';

class Context extends React.Component {


  static defaultProps = {
    menus: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      defaultBackgroundColor: '#ffffff',
      defaultTextColor: '#000000',
      selectBackgroundColor: '#ffffff',
      selectTextColor: '#1690ff',
      border: '1px solid #CDCDCD',
      menus: {},
    };
  }

  componentDidUpdate() {
    document.getElementById('contextmenu').focus();
    this._checkHeight();
  }

  componentDidMount() {
    this._checkHeight();
  }

  _checkHeight = () => {
    const {top} = this.props;
    const dom = ReactDom.findDOMNode(this.instance);
    const position = dom.getBoundingClientRect();
    const clientHeight = document.body.clientHeight;
    if ((position.height + top) >= clientHeight) {
      // 向下溢出了
      // 1.将其移动到节点的上方
      if (top - position.height >= 0) {
        dom.style.top = top - position.height + 'px';
      } else {
        dom.style.top = '0px';
      }
      /*if (clientHeight - position.height >= 0) {
        dom.style.top = clientHeight - position.height + 'px';
      } else {
        dom.style.top = '0px';
      }*/
    }
  };
  _mouseOver = (ev, key) => {
    ev.stopPropagation();
    // document.getElementById('contextmenu').focus();
    this.setState({
      menus: {
        ...this.state.menus,
        [key]: {
          backgroundColor: this.state.selectBackgroundColor,
          textColor: this.state.selectTextColor
        }
      }
    });
  };

  _mouseOut = (ev, key) => {
    ev.stopPropagation();
    this.setState({
      menus: {
        ...this.state.menus,
        [key]: {
          backgroundColor: this.state.defaultBackgroundColor,
          textColor: this.state.defaultTextColor
        }
      }
    });
  };

  _onClick = (e, key, item) => {
    const {onClick, closeContextMenu} = this.props;
    onClick && onClick(e, key, item);
    closeContextMenu && closeContextMenu();
  };

  _onBlur = () => {
    const {closeContextMenu} = this.props;
    closeContextMenu && closeContextMenu();
  };

  render() {
    const {menus, left, top, display} = this.props;
    return (<div
      tabIndex="0"
      onBlur={this._onBlur}
      id="contextmenu"
      ref={instance => this.instance = instance}
      style={{
        outline: 'none',
        position: 'absolute',
        display,
        backgroundColor: this.state.defaultBackgroundColor,
        border: this.state.border,
        minWidth: 160,
        zIndex: 999,
        left,
        top
      }}
    >
      <ul

        style={{width: '100%', height: '100%', listStyle: 'none', paddingInlineStart: '20px',marginBottom:'0px'}}
      >
        {
          menus.map(item => {
            console.log(115, item);
            return (<li
              onMouseOver={(ev) => this._mouseOver(ev, item.key)}
              onMouseOut={(ev) => this._mouseOut(ev, item.key)}
              key={item.key}
              style={{
                userSelect: 'none',
                width: '100%',
                cursor: 'pointer',
                padding: 5,
                backgroundColor: _.get(this.state.menus, [item.key] + '.backgroundColor',
                  this.state.defaultBackgroundColor),
                color: _.get(this.state.menus, [item.key] + '.textColor',
                  this.state.defaultTextColor)
              }}
              onClick={(e) => this._onClick(e, item.key, item)}
            >
              {item.name}
            </li>);
          })
        }
      </ul>
    </div>);
  }
}

export default Context;
