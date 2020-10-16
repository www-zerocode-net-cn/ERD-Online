import React from 'react';

import './style/index.less';

import { Icon, Checkbox } from '../index';

export default class TreeSelect extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      openKeys: [],
      allKeys: this._initAllKeys(props.data),
      checkeds: props.defaultSelecteds || [],
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data){
      this.setState({
        allKeys: this._initAllKeys(nextProps.data),
      });
    }
  }
  getKeys = () => {
    return this.state.checkeds;
  };
  _initAllKeys = (data) => {
    return (data || []).reduce((a, b) => {
      return (a.concat(b.entities.map(c => ({...c, key: `${b.name}/${c.title}`}))));
    }, (data || []).map(d => ({ key: d.name }))).map(k => k.key);
  };
  _onChange = (e, key) => {
    const { checkeds, allKeys } = this.state;
    let tempCheckeds = [...checkeds];
    if (e.target.value) {
      tempCheckeds.push(key);
      if (key.split('/').length === 1) {
        // 选中的是父key
        // 将所有的子key都设置为选中
        tempCheckeds.push(...allKeys.filter(k => k.split('/')[0] === key));
      } else {
        // 选中的是子key
        // 判断该节点下所有的key是否都被选中
        // 如果全部选中，则父节点选中
        const parentKey = key.split('/')[0];
        const allChildrenKey = allKeys.filter(k => k.split('/')[0] === parentKey && k !== parentKey);
        if (allChildrenKey.every(c => tempCheckeds.includes(c))) {
          tempCheckeds.push(parentKey);
        }
      }
    } else {
      tempCheckeds = tempCheckeds.filter(c => c !== key);
      if (key.split('/').length === 1) {
        // 如果父节点取消选中，则子节点全部取消选中
        tempCheckeds = tempCheckeds.filter(c => c.split('/')[0] !== key);
      } else {
        tempCheckeds = tempCheckeds.filter(c => c !== key.split('/')[0]);
      }
    }
    this.setState({
      checkeds: [...new Set(tempCheckeds)],
    }, () => {
      const { onChange } = this.props;
      onChange && onChange(this.state.checkeds);
    });
  };
  _iconClick = (key) => {
    const { openKeys } = this.state;
    let tempKeys = [...openKeys];
    if (tempKeys.includes(key)) {
      tempKeys = tempKeys.filter(k => k !== key);
    } else {
      tempKeys.push(key);
    }
    this.setState({
      openKeys: tempKeys,
    });
  };
  render() {
    const { data, titleRender } = this.props;
    const { openKeys, checkeds } = this.state;
    return (<div className='pdman-treeselect'>
      {
        data.map((d) => {
          return (
            <div className='pdman-treeselect-item' key={d.name}>
              <div className='pdman-treeselect-item-name'>
                <Icon
                  type="right"
                  onClick={() => this._iconClick(d.name)}
                  style={{
                    transform: openKeys.includes(d.name) ? 'rotate(90deg)' : 'rotate(0deg)',
                  }}
                />
                <Checkbox
                  value={checkeds.includes(d.name)}
                  onChange={e => this._onChange(e, d.name)}
                  wrapperStyle={{width: 20}}
                />
                <span>{d.name}</span>
              </div>
              <div
                className='pdman-treeselect-item-children'
                style={{display: openKeys.includes(d.name) ? '' : 'none'}}
              >
                {
                  (d.entities || []).map((c) => {
                    return (
                      <div className='pdman-treeselect-item-children-item' key={c.title}>
                        <Checkbox
                          value={checkeds.includes(d.name) || checkeds.includes(`${d.name}/${c.title}`)}
                          onChange={e => this._onChange(e, `${d.name}/${c.title}`)}
                          wrapperStyle={{width: 20}}
                        />
                        <span>{ titleRender ? titleRender(c) : `${c.chnname || c.title}(${c.title})`}</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          );
        })
      }
    </div>);
  }
}
