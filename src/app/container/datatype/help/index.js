import React from 'react';

import { Button } from '../../../../components';

import './style/index.less';

export default class Help extends React.Component{
  close = () => {
    const { onCancel } = this.props;
    onCancel && onCancel();
  }
  render() {
    return (<div className='pdman-datatype-help'>
      <div className='pdman-datatype-help-step'>
        {}
      </div>
      <div className='pdman-datatype-help-opt'>
        <Button onClick={this.close}>知道了</Button>
      </div>
    </div>);
  }
}
