/* eslint-disable */
import React from 'react';
import './style/index.less';
// import Immutable from 'immutable';

import TreeNode from './TreeNode';
import { Input } from '../index';
import { addOnResize } from '../../utils/listener';
import defaultConfig from '../../../profile';

class Tree extends React.Component {

  static defaultProps = {
    defaultChecked: '',
    defaultExpanded: '',
    showSearch: false,
  };

  static TreeNode = TreeNode;

  constructor(props) {
    super(props);
    this.flag = true;
    this.state = {
      checked: [],
      cancelChecked: [],
      blurChecked: [],
      height: document.body.clientHeight,
      searchValue: '',
    };
  }

  componentDidMount(){
    addOnResize(this._setTabsHeight);
  }
  componentWillUnmount(){
    this.flag = false;
  }
  _setTabsHeight = () => {
    this.flag && this.setState({
      height: document.body.clientHeight
    })
  };

  _onClick = (e, value, cb) => {
    const { onClick } = this.props;
    const { cancelChecked } = this.state;
    const { checked } = this.state;
    let tempChecked = [...checked];
    let tempCancelChecked = [...cancelChecked];
    document.getElementById('tree').focus();
    onClick && onClick(value);
    // 判断是否按住了shift
    if (e.shiftKey) {
      if (tempChecked.includes(value)) {
        tempChecked = tempChecked.filter(c => c !== value);
        tempCancelChecked = [value];
      } else {
        tempCancelChecked = [];
        tempChecked.push(value);
      }
    } else {
      tempCancelChecked = tempChecked;
      tempChecked = [value];
    }
    // 去重
    this.setState({
      cancelChecked: [...new Set(tempCancelChecked)],
      checked: [...new Set(tempChecked)],
      blurChecked: []
    }, () => {
      // 点击后渲染结束回调
      cb && cb();
    });
  };

  _onDoubleClick = (value) => {
    const { onDoubleClick } = this.props;
    onDoubleClick && onDoubleClick(value);
  };

  // 递归给子组件注入参数
  _setProps = (item, row, onDrop, onContextMenu) => {
    let tempValue = [];
    const component = [].concat(item.props.children).map(child => {
      tempValue.push(child.props.value);
      if (!tempValue.includes(child.props.realName)) {
        tempValue.push(child.props.realName);
      }
      const childrenData = child.props.children &&
        this._setProps(child, row + 1, onDrop, onContextMenu);
      tempValue = tempValue.concat((childrenData && childrenData.value) || []);
      return {
        ...child,
        props: {
          ...child.props,
          onClick: this._onClick,
          onDrop,
          onContextMenu,
          onDoubleClick: this._onDoubleClick,
          children: childrenData && childrenData.component,
          childrenValue: (childrenData && childrenData.value) || [],
          row: row + 1,
          checked: this.state.checked,
          cancelChecked: this.state.cancelChecked,
          blurChecked: this.state.blurChecked,
          searchValue: this.state.searchValue,
        }
      };
    });
    return {
      component,
      value: tempValue
    };
  };

  _onBlur = () => {
    // 调整选中树节点的背景色
    this.setState({
      blurChecked: [...new Set(this.state.checked)],
    });
  };
  resetSearchWidth = () => {
    this.searchInstance.style.width = 'calc(20% - 10px)';
  };
  updateSearchWidth = (width) => {
    this.searchInstance.style.width = `${width - 10}px`;
  };
  _searchChange = (e) => {
    this.setState({
      searchValue: e.target.value,
    });
  };
  _onContextMenu = (e, value) => {
    const { onContextMenu } = this.props;
    onContextMenu && onContextMenu(e, value, this.state.checked);
  };
  render() {
    const { children, onDrop, showSearch } = this.props;
    const { height } = this.state;
    return (<div
      tabIndex="0"
      className='pdman-tree'
      onBlur={this._onBlur}
      id="tree"
      style={{
        height: height - 105 - defaultConfig.menuHeight,
      }}
    >
      <div
        ref={instance => this.searchInstance = instance}
        style={{
          width: 'calc(20% - 10px)',
          padding: '5px 5px 5px 10px',
          position: 'fixed',
          background: '#FFFFFF',
          zIndex: 99,
          minWidth: 190,
          maxWidth: '80%',
          display: showSearch ? '' : 'none',
        }}>
        <Input onChange={this._searchChange} placeholder='快速搜索数据表' style={{width: '100%', height: 20}}/>
      </div>
      <ul style={{marginTop: showSearch ? 32 : 0}}>
        {[].concat(children).map(item => {
          const childrenData = item.props.children &&
            this._setProps(item, 0, onDrop, this._onContextMenu);
          return {
            ...item,
            props: {
              ...item.props,
              onClick: this._onClick,
              onDrop,
              onContextMenu: this._onContextMenu,
              onDoubleClick: this._onDoubleClick,
              children: childrenData && childrenData.component,
              childrenValue: (childrenData && childrenData.value) || [],
              row: 0,
              checked: this.state.checked,
              cancelChecked: this.state.cancelChecked,
              blurChecked: this.state.blurChecked,
              searchValue: this.state.searchValue,
            }
          };
        })}
      </ul>
    </div>);
  }
}

export default Tree;
