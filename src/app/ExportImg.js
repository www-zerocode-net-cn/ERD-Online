import React from 'react';
import { RadioGroup } from '../components';

const Radio = RadioGroup.Radio;

export default class ExportImg extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      value: 'view',
    };
  }
  getType = () => {
    return this.state.value;
  };
  _onChange = (value) => {
    this.setState({
      value,
    });
  };
  render() {
    return (
      <div>
        <RadioGroup
          onChange={this._onChange}
          value={this.state.value}
          groupStyle={{flexDirection: 'column'}}
        >
          <Radio
            wrapperStyle={{width: '20px'}}
            value='all'
          >
            <span>导出整张关系图（当关系图内容较多时可能无法保证清晰度）</span>
          </Radio>
          <Radio
            wrapperStyle={{width: '20px'}}
            value='view'
          >
            <span>导出当前窗口可见区域内的关系图（当关系图内容较多时可能无法保证完整度）</span>
          </Radio>
        </RadioGroup>
      </div>
    );
  }
}
