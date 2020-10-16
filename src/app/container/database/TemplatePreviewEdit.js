import React from 'react';

import { Code, Editor, Button, openModal } from '../../../components';

import { getDataByTemplate } from '../../../utils/json2code';
import { addOnResize } from '../../../utils/listener';

import './style/index.less';

class DotHelp extends React.Component{
  render(){
    return (<div
      style={{
        userSelect: 'initial',
      }}
    >
      <div style={{padding: 5}}>官网：https://github.com/olado/doT</div>
      <div>
        <div>
          <span style={{padding: 5, display: 'block'}}>语法对照：参考地址：https://tech.meituan.com/dot.html</span>
          <table style={{width: '100%', padding: 5}} className='pdman-normal-table'>
            <tbody>
              <tr className='pdman-data-table-content-table-first-tr'>
                <th>项目</th>
                <th>JavaScript语法</th>
                <th>对应语法</th>
                <th>案例</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>输出变量</th>
                <th>=</th>
                <th>{'{{=变量名}}'}</th>
                <th>{'{{=it.name}}'}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>条件判断</th>
                <th>if</th>
                <th>{'{{? 条件表达式}}'}</th>
                <th>{'{{? i > 3}}'}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>条件转折</th>
                <th>else/else if</th>
                <th>{'{{??}}/{{?? 表达式}}'}</th>
                <th>{'{{?? i ==2}}'}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>循环遍历</th>
                <th>for</th>
                <th>{'{{~ 循环变量}}'}</th>
                <th>{'{{~ it.arr:item}}...{{~}}'}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>执行方法</th>
                <th>funcName()</th>
                <th>{'{{= funcName() }}'}</th>
                <th>{'{{= it.sayHello() }}'}</th>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <span style={{padding: 5, display: 'block'}}>全局方法：可以通过it.func.方法名使用</span>
          <table style={{width: '100%', padding: 5}} className='pdman-normal-table'>
            <tbody>
              <tr className='pdman-data-table-content-table-first-tr'>
                <th>方法名</th>
                <th>方法功能</th>
                <th>参数介绍</th>
                <th>案例</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>camel</th>
                <th>下划线转驼峰</th>
                <th>参数1：需要转化的字符串，参数2：首字母是否需要大写</th>
                <th>{"('USER_NAME', true) => 'userName'"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>underline</th>
                <th>驼峰转下划线</th>
                <th>参数1：需要转化的字符串，参数2：是否全大写</th>
                <th>{"('userName', true) => 'USER_NAME'"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>upperCase</th>
                <th>全大写</th>
                <th>参数1：需要转化的字符串</th>
                <th>{"('userName') => 'USERNAME'"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>lowerCase</th>
                <th>全小写</th>
                <th>参数1：需要转化的字符串</th>
                <th>{"('USERNAME') => 'useranem'"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>join</th>
                <th>多个字符串拼接</th>
                <th>不限参数，最后一个参数为拼接符</th>
                <th>{"('user','name','/') => 'user/name'"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>intersect</th>
                <th>两个数组交集</th>
                <th>参数1：数组1，参数2：数组2</th>
                <th>{"(['1', '2'], ['1', '2', '3']) => ['1', '2']"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>union</th>
                <th>两个数组并集</th>
                <th>参数1：数组1，参数2：数组2</th>
                <th>{"(['1', '2'], ['1', '2', '3']) => ['1', '2', '3']"}</th>
              </tr>
              <tr className='pdman-data-table-content-table-normal-tr'>
                <th>minus</th>
                <th>两个数组差集</th>
                <th>参数1：数组1，参数2：数组2；（数组1比数组2多出的数据）</th>
                <th>{"(['1', '2', '3'], ['1', '2']) => ['3']"}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>);
  }
}

export default class TemplatePreviewEdit extends React.Component{
  constructor(props){
    super(props);
    this.flag = true;
    this.state = {
      value: props.value,
      data: '',
      height: document.body.clientHeight,
      width: document.body.clientWidth,
    };
  }
  componentDidMount(){
    addOnResize(() => {
      this.flag && this.setState({
        height: document.body.clientHeight,
        width: document.body.clientWidth,
      });
    });
  }
  componentWillUnmount(){
    this.flag = false;
  }
  getValue = () => {
    return this.state.value;
  };
  _valueChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };
  _preview = () => {
    const { value } = this.state;
    const { demoData } = this.props;
    this.setState({
      data: getDataByTemplate(JSON.parse(demoData), value),
    });
  };
  _openHelp = () => {
    let modal = null;
    const onOk = () => {
      modal && modal.close();
    };
    modal = openModal(<DotHelp/>, {
      title: '语法介绍',
      footer: [<Button key="ok" onClick={onOk} type="primary">关闭</Button>],
    });
  };
  render(){
    const { value, height, width } = this.state;
    const { mode, demoData } = this.props;
    const tempWidth = width - 50;
    const tempHeight = height - 25;
    return (
      <div style={{display: 'flex'}}>
        <div style={{padding: 5}}>
          <div style={{textAlign: 'center', marginBottom: 5}}>
            <span>参考数据</span>
          </div>
          <div>
            <Code
              style={{height: tempHeight - 100, width: tempWidth * 0.2}}
              language='JSON'
              data={demoData}
            />
          </div>
        </div>
        <div style={{padding: 5}}>
          <div style={{textAlign: 'center', marginBottom: 5}}>
            <span>模板代码编辑</span>
            <Button
              title='点击可在右侧查看生成的代码结果'
              onClick={this._preview}
              style={{
                marginLeft: 20,
                color: 'green',
              }}
            >
              预览
            </Button>
            <span
              onClick={this._openHelp}
              style={{
                textDecoration: 'underline',
                marginLeft: 20,
                color: 'green',
                cursor: 'pointer',
              }}
            >
              dot.js语法介绍
            </span>
          </div>
          <div>
            <Editor
              height={`${tempHeight - 100}px`}
              width={`${tempWidth * 0.5}px`}
              mode={mode}
              value={value}
              onChange={this._valueChange}
            />
          </div>
        </div>
        <div style={{padding: 5}}>
          <div style={{textAlign: 'center', marginBottom: 5}}>
            <span>预览结果</span>
          </div>
          <div>
            <Code
              style={{height: tempHeight - 100, width: tempWidth * 0.3}}
              language={mode}
              data={this.state.data}
            />
          </div>
        </div>
      </div>);
  }
}
