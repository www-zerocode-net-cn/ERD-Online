import React from 'react';

import { Checkbox } from '../../../components';

import './style/importFields.less';

export default class ImportFields extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      selects: {},
    };
  }
  getFields = () => {
    const { dataTable } = this.props;
    const { selects } = this.state;
    const tempFields = [];
    Object.keys(selects).forEach((s) => {
      if (selects[s]) {
        tempFields.push((dataTable.fields || []).filter(f => f.key === s)[0]);
      }
    });
    return tempFields;
  };
  _onChange = (e, key) => {
    const { selects } = this.state;
    this.setState({
      selects: {
        ...selects,
        [key]: e.target.value,
      },
    });
  };
  render(){
    const { selects = {} } = this.state;
    const { dataTable, fields = [] } = this.props;
    const fieldsName = fields.map(f => f.name);
    // 过滤掉已经引入的字段
    const tempFields = (dataTable.fields || []).filter(f => !fieldsName.includes(f.name));
    return (<div className='pdman-import-fields'>
      {
        tempFields.map(f => (
          <div key={f.key} className='pdman-import-fields-field'>
            <Checkbox
              wrapperStyle={{width:'auto'}}
              style={{height: 21}}
              onChange={e => this._onChange(e, f.key)}
              value={selects[f.key]}
            />
            <span className='pdman-import-fields-field-name'>{`${f.name}(${f.chnname})`}</span>
          </div>
        ))
      }
    </div>);
  }
}
