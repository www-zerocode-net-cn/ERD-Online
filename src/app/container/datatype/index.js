import React from 'react';
import _object from 'lodash/object';

import { Input } from '../../../components';
import * as DataTypeUtils from './DataTypeUtils';

import './style/index.less';

export default class DataType extends React.Component{
  static DataTypeUtils = DataTypeUtils;
  _validate = (data) => {
    const { validate, dataSource, value = {} } = this.props;
    if (validate) {
      const dataTypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
      const name = data.name || value.name;
      const code = data.code || value.code;
      let codeflag = true;
      let nameflag = true;
      if (!code || (dataTypes.map(dataType => dataType.code))
        .some(dataTypeCode => (dataTypeCode === code) && (value.code !== code))) {
        codeflag = false;
        this.status = {
          ...(this.status || {}),
          codeMessage: !code ? '数据类型代码不能为空' : '数据类型代码不能重复',
        };
      } else {
        codeflag = true;
        this.status = {
          ...(this.status || {}),
          codeMessage: '',
        };
      }
      if (!name || dataTypes.map(dataType => dataType.name)
        .some(dataTypeName => (dataTypeName === name) && (value.name !== name))) {
        nameflag = false;
        this.status = {
          ...(this.status || {}),
          nameMessage: !name ? '数据类型名称不能为空' : '数据类型名称不能重复',
        };
      } else {
        nameflag = true;
        this.status = {
          ...(this.status || {}),
          nameMessage: '',
        };
      }
      this.setState({
        ...this.status,
      });
      validate && validate(nameflag && codeflag);
    }
  };
  _onChange = (e, value, db) => {
    const { onChange } = this.props;
    if (value) {
      this.dataType = {
        ...(this.dataType || {}),
        [value]: e.target.value,
      };
    } else {
      this.dataType = {
        ...(this.dataType || {}),
        apply: {
          ..._object.get(this.dataType || {}, 'apply', {}),
          [db]: {
            type: e.target.value,
          },
        },
      };
    }
    onChange && onChange(this.dataType);
    this._validate(this.dataType);
  };
  render() {
    const { dataSource, prefix = 'pdman', value = {} } = this.props;
    return (<div className={`${prefix}-data-type-wrapper`}>
      <div className={`${prefix}-data-type-wrapper-item`}>
        <div className={`${prefix}-data-type-wrapper-item-content`}>
          <div className={`${prefix}-data-type-wrapper-item-label`}>名称:</div>
          <div className={`${prefix}-data-type-wrapper-item-component`}>
            <Input
              style={{width: '100%'}}
              onChange={e => this._onChange(e, 'name')}
              defaultValue={value.name}
            />
          </div>
        </div>
        <div className={`${prefix}-data-type-wrapper-item-message`}>
          <span>{this.state && this.state.nameMessage}</span>
        </div>
      </div>
      <div className={`${prefix}-data-type-wrapper-item`}>
        <div className={`${prefix}-data-type-wrapper-item-content`}>
          <div className={`${prefix}-data-type-wrapper-item-label`}>代码:</div>
          <div className={`${prefix}-data-type-wrapper-item-component`}>
            <Input
              style={{width: '100%'}}
              onChange={e => this._onChange(e, 'code')}
              defaultValue={value.code}
            />
          </div>
        </div>
        <div className={`${prefix}-data-type-wrapper-item-message`}>
          <span>{this.state && this.state.codeMessage}</span>
        </div>
      </div>
      <div className={`${prefix}-data-type-wrapper-item-group`}>
        <div className={`${prefix}-data-type-wrapper-item-group-label`}>数据库对应类型</div>
        <div>
          {_object.get(dataSource, 'dataTypeDomains.database', []).map((database) => {
            return (<div
              className={`${prefix}-data-type-wrapper-item-content ${prefix}-data-type-wrapper-item-group-content`}
              key={database.code}
            >
              <div className={`${prefix}-data-type-wrapper-item-label`}>{`${database.code}:`}</div>
              <div className={`${prefix}-data-type-wrapper-item-component`}>
                <Input
                  style={{width: '100%'}}
                  onChange={e => this._onChange(e, null, database.code)}
                  defaultValue={_object.get(value, `apply.${database.code}.type`, '')}
                />
              </div></div>);
          })}
        </div>
      </div>
    </div>);
  }
}
