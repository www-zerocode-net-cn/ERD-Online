import React from 'react';
import _object from 'lodash/object';
import { Select, Button, Modal, openModal } from '../../../../components';
import './style/readdb.less';
import Parse from './Parse';

// 从已有的数据库中获取表信息
export default class ReadDB extends React.Component{
  constructor(proos){
    super(proos);
    this.dbs = _object.get(this.props.dataSource, 'profile.dbs', []);
    this.state = {
      currentDB: this._getCurrentDB(this.dbs),
      dataFormat: 'UPPERCASE',
    };
  }
  _getCurrentDB = (dbs) => {
    const db = dbs.filter(d => d.defaultDB)[0];
    if (db) {
      return db.name;
    }
    return '';
  };
  _dbChange = (e) => {
    this.setState({
      currentDB: e.target.value,
    });
  };
  _dataFormatChange = (e) => {
    this.setState({
      dataFormat: e.target.value,
    });
  };
  _selectDBNext = () => {
    const { success, dataSource } = this.props;
    const { currentDB, dataFormat } = this.state;
    const db = this.dbs.filter(d => d.name === currentDB)[0];
    if (!db) {
      Modal.error({title: '操作失败！', message: '请先选择数据库'});
    } else {
      openModal(<Parse db={db} dataSource={dataSource} dataFormat={dataFormat}/>, {
        title: '获取数据库信息',
        onOk: (m, c) => {
          c.getSelectedEntity((keys, data) => {
            m && m.close();
            // 处理数据并且保存到文件
            success && success(keys, data);
          });
        },
      });
    }
  };
  render() {
    const { currentDB, dataFormat } = this.state;
    return (
      <div className='pdman-readdb'>
        <div className='pdman-readdb-db-select'>
          <span className='pdman-readdb-db-select-span'>请选择需要解析的数据库：</span>
          <Select value={currentDB} style={{minWidth: 200}} onChange={this._dbChange}>
            <option key='' value=''>-请选择-</option>
            {
              this.dbs.map(db => (<option key={db.name} value={db.name}>{db.name}</option>))
            }
          </Select>
          <span style={{color: 'red', paddingLeft: 5}}>[暂时不支持索引解析生成]</span>
        </div>
        <div className='pdman-readdb-db-select-dataFormat'>
          <span className='pdman-readdb-db-select-dataFormat-span'>逻辑名格式：</span>
          <Select value={dataFormat} onChange={this._dataFormatChange}>
            <option value='UPPERCASE'>全大写</option>
            <option value='LOWCASE'>全小写</option>
            <option value='DEFAULT'>不处理</option>
          </Select>
        </div>
        <div className='pdman-readdb-db-continue'>
          <Button icon='fa-arrow-right' type='primary' onClick={this._selectDBNext}>下一步</Button>
        </div>
      </div>
    );
  }
}
