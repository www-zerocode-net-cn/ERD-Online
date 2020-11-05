import React from 'react';
import { Button, Modal } from '../components';
import './style/word.less';

import { post, get } from '../utils/fetch';
import * as cache from '../utils/cache';
import * as File from '../utils/file';


export default class WORDConfig extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data: props.data,
    };
  }
  _iconClick = (btn) => {
    this.btn = btn;
    this.upload && this.upload.click();
  };
  _saveTemplate = () => {
    // 获取word的目录
    const projectId = cache.getItem('projectId');
    get(`connector/downloadWrodTpl/${projectId}`, true).then((res) => {
      File.saveByBlob(res, 'templet.docx');
    });
  };
  _onChange = (e) => {
    const { files = [] } = e.target;
    if (files[0]) {
      if (!files[0].name.endsWith('.docx')) {
        Modal.error({
          title: '上传失败！',
          message: '请上传以.docx为后缀的文件！',
        });
        return;
      }
      // 开始上传
      this.btn.setLoading(true);
      const projectId = cache.getItem('projectId');
      const form = new FormData();
      const file = files[0];
      form.append('file', file);
      form.append('projectId', projectId);
      post('connector/uploadWrodTpl', {},  {}, form).then((res) => {
        const { onChange } = this.props;
        this.setState({
          data: res.data,
        }, () => {
          onChange && onChange(res.data);
        });
      }).catch((err) => {
        Modal.error({title: '上传失败！', message: err.message});
      }).finally(() => {
        this.btn.setLoading(false);
      });
    }
  };
  render() {
    const { data } = this.state;
    return (
      <div className='pdman-config-word'>
        <div className='pdman-config-word-config'>
          <div className='pdman-config-word-config-label'>
            <span>WORD模板:</span>
          </div>
          <div className='pdman-config-word-config-input'>
            <input
              placeholder='默认为系统自带的模板，如需修改，请先另存为，再指定模板文件'
              value={data || ''}
              readOnly
              onChange={this._onChange}
            />
            <input
              onChange={this._onChange}
              ref={instance => this.upload = instance}
              style={{display: 'none'}}
              type='file'
              accept='.docx'
            />
          </div>
          <div className='pdman-config-word-config-button'>
            <Button onClick={this._iconClick} title='从本地选择模板'>...</Button>
            <Button style={{marginLeft: 5}} onClick={this._saveTemplate}>模板另存为</Button>
          </div>
        </div>
      </div>
    );
  }
}
