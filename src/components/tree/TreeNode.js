/* eslint-disable */
import React from 'react';
import _object from 'lodash/object';

import Icon from '../icon';

const defaultColor = '#EBEEF2';
const selectColor = '#1A7DC4';
const blurColor = '#CDDDF6';
const selectTextColor = '#FFFFFF';
const defaultTextColor = '#000000';

class TreeNode extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      iconWidth: 15,
      iconHeight: 15,
      padding: 2,
      rotate: 'rotate(0deg)',
      display: 'none',
      color: {
        textColor: defaultTextColor,
        backgroundColor: defaultColor
      }
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return ((nextState.color.backgroundColor !== this.state.color.backgroundColor)
      || (nextState.rotate !== this.state.rotate) || (nextState.display !== this.state.display)
      || this._validateChildren(nextProps))
      || this._validateSearchValue(nextProps);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.blurChecked.includes(this.props.value)) {
      this.setState({
        color: {
          textColor: defaultTextColor,
          backgroundColor: blurColor
        }
      });
    } else if (nextProps.checked.includes(this.props.value)) {
      this.setState({
        color: {
          textColor: selectTextColor,
          backgroundColor: selectColor
        }
      });
    } else {
      this.setState({
        color: {
          textColor: defaultTextColor,
          backgroundColor: defaultColor
        }
      });
    }
    const { searchValue } = nextProps;
    const childrenValue = nextProps.childrenValue
      .filter(c => c && !c.startsWith('map&') && !c.startsWith('table&'))
      .map(c => (c.split('&')[2] || c).toLocaleLowerCase());
    if (searchValue !== this.props.searchValue) {
      if (searchValue && childrenValue.some(c => c && c.includes(searchValue.toLocaleLowerCase()))) {
        this.setState({
          rotate: 'rotate(90deg)',
          display: '',
        });
      } else {
        this.setState({
          rotate: 'rotate(0deg)',
          display: 'none',
        });
      }
    }
  }
  _validateSearchValue = (nextProps) => {
    if (nextProps.searchValue !== this.props.searchValue) {
      const childrenValue = nextProps.childrenValue
        .filter(c => c && !c.startsWith('map&') && !c.startsWith('table&'))
        .map(c => (c.split('&')[2] || c).toLocaleLowerCase());
      const children = _object.get(nextProps, 'name.props.children', []).map(c => {
        if (typeof c === 'string') {
          return c.toLocaleLowerCase();
        }
        return c;
      });
      const flag = ((nextProps.searchValue && childrenValue.some(c => c && c.includes(nextProps.searchValue.toLocaleLowerCase())))
        || (nextProps.searchValue && children[1] && children[1].includes(nextProps.searchValue.toLocaleLowerCase()))
        || (this.props.searchValue && childrenValue.some(c => c && c.includes(this.props.searchValue.toLocaleLowerCase())))
        || (this.props.searchValue && children[1] && children[1].includes(this.props.searchValue.toLocaleLowerCase())));
      return !!flag;
    }
    return false;
  };
  _validateChildren = (nextProps) => {
    // 校验子节点的数据是否发生了变化
    const { childrenValue } = this.props;
    const nextChildrenValue = nextProps.childrenValue;
    return (childrenValue.length !== nextChildrenValue.length) ||
      childrenValue.some((value, index) => value !== nextChildrenValue[index])
      || this._checkChildrenChange(nextProps) || (this.props.realName !== nextProps.realName);
  };

  _checkChildrenChange = (nextProps) => {
    const { childrenValue, cancelChecked, checked } = nextProps;
    const checkChildren = childrenValue.some(v => checked.includes(v));
    const cancelCheckedChildren = childrenValue.some(v => cancelChecked.includes(v));
    return checkChildren || cancelCheckedChildren;
  };

  _rightIconOnDoubleClick = (e) => {
    e.stopPropagation();
  };

  _rightIconOnClick = (e, value, child) => {
    const { rightIconOnClick } = this.props;
    e && e.stopPropagation();
    rightIconOnClick && rightIconOnClick(e, value, child);
    const { display } = this.state;
    this.setState({
      rotate: this.state.rotate === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)',
      display: (display === undefined || display === '') ? 'none' : '',
    });
  };

  _getTreeValue = (name, value, hasChild, row) => {
    if (hasChild) {
      return (<span
        style={{ padding: this.state.padding, paddingLeft: (row * (this.state.iconWidth + 5)) + 5 }}
      >
        <Icon
          type="right"
          onClick={(e) => this._rightIconOnClick(e, value, hasChild)}
          onDoubleClick={this._rightIconOnDoubleClick}
          style={{
            verticalAlign: 'middle',
            transform: this.state.rotate
          }}
        />
        <Icon type="fa-folder" style={{ verticalAlign: 'middle', marginLeft: 5, color: '#FFAC33' }} />
        <span
          style={{
            padding: this.state.padding,
            color: this.state.color.textColor,
            verticalAlign: 'middle' }}
        >{name}</span>
      </span>);
    }
    const children = _object.get(this.props, 'name.props.children', [])
      .map(c => {
        if (typeof c === 'string') {
          return c.toLocaleLowerCase();
        }
        return c;
      });
    return (<span
      style={{ padding: this.state.padding, paddingLeft: (row * (this.state.iconWidth + 5)) + 5 }}
    >
      <span
        style={{
          padding: this.state.padding,
          color: (this.props.searchValue && children[1] && children[1].includes(this.props.searchValue.toLocaleLowerCase())) ?
            'red': this.state.color.textColor,
          verticalAlign: 'middle'
        }}
      >{name}
      </span>
    </span>);
  };

  _onContextMenu = (e, value) => {
    e.preventDefault();
    e.stopPropagation();
    e.persist();
    const { onContextMenu, checked } = this.props;
    if (checked.length < 2) {
      // 如果是多选则不需要先选中再失去焦点
      this._onClick(e, value, () => {
        onContextMenu && onContextMenu(e, value);
      });
    } else {
      onContextMenu && onContextMenu(e, value);
    }
  };

  _onClick = (e, value, cb) => {
    e.stopPropagation();
    const { onClick } = this.props;
    onClick && onClick(e, value, cb);
  };

  _onDoubleClick = (e, value, children) => {
    e.stopPropagation();
    const { onDoubleClick } = this.props;
    if (children) {
      this.setState({
        rotate: this.state.rotate === 'rotate(90deg)' ? 'rotate(0deg)' : 'rotate(90deg)'
      });
    }
    onDoubleClick && onDoubleClick(value, children);
    if (children) {
      this._rightIconOnClick(e, value, children);
    }
  };

  _onDrop = (e, value) => {
    const { onDrop } = this.props;
    e.preventDefault();
    e.stopPropagation();
    const data = e.dataTransfer.getData('Text');
    onDrop && onDrop(value, data);
  };
  _onDragOver = (e) => {
    e.preventDefault();
  };
  _onDragStart = (e, value) => {
    e.stopPropagation();
    e.dataTransfer.setData("Text", value);
  };
  _getRender = (show, value, children, name, row, draggable) => {
    return (children && [].concat(children).length > 0 ?
      <ul
        id={value}
        draggable={draggable}
        onDrop={(e) => this._onDrop(e, value)}
        onDragOver={this._onDragOver}
        onDragStart={(e) => this._onDragStart(e, value)}
        onContextMenu={(e) => this._onContextMenu(e, value)}
        style={{
          backgroundColor: this.state.color.backgroundColor,
          cursor: 'default'
        }}
        key={value}
        onClick={(e) => this._onClick(e, value)}
        onDoubleClick={(e) => this._onDoubleClick(e, value, children)}
      >
        <span>{this._getTreeValue(name, value, children, row)}</span>
        <div style={{ display: this.state.display }}>
          { children }
        </div>
      </ul> :
      <li
        id={value}
        draggable={true}
        onDragStart={(e) => this._onDragStart(e, value)}
        onDrop={(e) => this._onDrop(e, value)}
        onContextMenu={(e) => this._onContextMenu(e, value)}
        style={{
          backgroundColor: this.state.color.backgroundColor,
          whiteSpace: 'nowrap',
          //overflow: 'hidden',
          //textOverflow: 'ellipsis'
        }}
        key={value}
        onClick={(e) => this._onClick(e, value)}
        onDoubleClick={(e) => this._onDoubleClick(e, value, children)}
      >
        {this._getTreeValue(name, value, false, row)}</li>
    );
  };

  render() {
    const { show, value, children, name, row, draggable } = this.props;
    return this._getRender(show, value, children, name, row, draggable);
  }
}

export default TreeNode;
