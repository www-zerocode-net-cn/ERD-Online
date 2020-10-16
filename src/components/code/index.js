import React from 'react';
import ReactDom from 'react-dom';
import './style/index.less';
/* eslint-disable */
export default class Code extends React.Component{
  componentDidMount(){
    this.dom = ReactDom.findDOMNode(this.instance);
    hljs.highlightBlock(this.dom);
  };
  componentDidUpdate(){
    hljs.highlightBlock(this.dom);
  }
  shouldComponentUpdate(nextProps){
    return (nextProps.data !== this.props.data) || this._checkStyle(nextProps);
  };
  _checkStyle = (nextProps) => {
    const nextStyle = nextProps.style || {};
    const thisStyle = this.props.style || {};
    return (nextStyle.height !== thisStyle.height) || (nextStyle.width !== thisStyle.width)
  };
  render() {
    const { data, style, prefix = 'pdman' } = this.props;
    return (<div style={style} className={`${prefix}-code`}>
      <pre ref={instance => this.instance = instance} style={style}>
        {data}
      </pre>
    </div>);
  }
}
