import React from 'react';

import {Modal} from '../components';
import Home from './Home';
import {fileExist, readFilePromise, saveFilePromise} from '../utils/json';
import {getCurrentVersion} from '../utils/update';
import defaultConfig from '../profile';
import './style/loading.less';

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.split = process.platform === 'win32' ? '\\' : '/';
        this.historyPath = `${this.configPath}${this.split}${defaultConfig.configPath}`;
        this.state = {
            width: '90%',
            histories: [],
            columnOrder: [
                {code: 'chnname', value: '字段名', com: 'Input', relationNoShow: false},
                {code: 'name', value: '逻辑名', com: 'Input', relationNoShow: false},
                {code: 'type', value: '类型', com: 'Select', relationNoShow: false},
                {code: 'dataType', value: '数据库类型', com: 'Text', relationNoShow: true},
                {code: 'remark', value: '说明', com: 'Input', relationNoShow: true},
                {code: 'pk', value: '主键', com: 'Checkbox', relationNoShow: false},
                {code: 'notNull', value: '非空', com: 'Checkbox', relationNoShow: true},
                {code: 'autoIncrement', value: '自增', com: 'Checkbox', relationNoShow: true},
                {code: 'defaultValue', value: '默认值', com: 'Input', relationNoShow: true},
                {code: 'relationNoShow', value: '关系图', com: 'Icon', relationNoShow: true},
                {code: 'uiHint', value: 'UI建议', com: 'Select', relationNoShow: true},
            ],
        };
    }

    componentDidMount() {

        setTimeout(() => {
            if (fileExist(this.historyPath)) {
                readFilePromise(this.historyPath).then((res) => {
                    this.setState({
                        histories: res.histories || [],
                        width: '100%',
                    });
                }).catch((e) => {
                    this.setState({
                        width: '100%',
                    });
                    Modal.error({
                        title: '读取系统配置失败!',
                        message: e.message,
                    });
                });
            } else {
                this.setState({
                    width: '100%',
                });
            }
        }, 2000);
    }

    render() {
        if (this.state.width !== '100%') {
            const version = getCurrentVersion();
            return (<div className='pdman-loading-content'>
                <div className='pdman-loading-content-img'>
                    <div style={{textAlign: 'center', marginTop: 100}}>
                        <div className='pdman-loading-content-logo'>{}</div>
                        <div className='pdman-loading-content-welcom'>
                            <span style={{fontSize: 35, fontWeight: 2, color: '#65B1F0'}}>WELCOME</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{fontSize: 35, fontWeight: 2, color: '#FFF'}}>PDMAN</span>
                        </div>
                    </div>
                    <div style={{position: 'relative', width: '100%', height: '30%'}}>
                        <span style={{position: 'absolute', left: '26%', bottom: 5, color: '#FFF'}}>正在加载...</span>
                        <div className='pdman-loading-content-progress'>
                            <div className='pdman-loading-content-progress-base'>
                                <div className='pdman-loading-content-progress-base-line'
                                     style={{width: this.state.width}}>{}</div>
                            </div>
                        </div>
                    </div>
                    <div className='pdman-loading-content-footer'>
                        <div className='pdman-loading-content-footer-content'>
                            Copyright© {version.date.split('.')[0]} robergroup team All rights reserved
                        </div>
                    </div>
                </div>
            </div>);
        }
        return (<Home
            histories={this.state.histories}
            columnOrder={this.state.columnOrder}
        />);
    }
}
