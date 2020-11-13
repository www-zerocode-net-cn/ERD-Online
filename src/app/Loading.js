import React from 'react';
import Home from './Home';
import './style/loading.less';
import defaultData from './defaultData';

import {get} from '../utils/fetch';
import * as cache from '../utils/cache';
import {Modal} from '../components';
import * as Save from '../utils/save';
import ErdLayout from "./ErdLayout";

import request from "../utils/request";

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: '90%',
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
            data: {},
        };
    }

    componentDidMount() {
        // 增加两秒的延迟时间
        let result = {};
        let flag = false;
        setTimeout(() => {
            if (result && result.data) {
                this.setState({width: '100%', data: result.data});
            } else {
                flag = true;
            }
        }, 2000);
        const projectId = cache.getItem('projectId');
        request.get(`/project/info/${projectId}`).then((res) => {
            if (flag) {
                this.setState({width: '100%', data: result.data});
            } else {
                result = res;
            }
        }).catch((err) => {
            Modal.error({
                title: '打开项目失败！',
                message: `出错原因：${err.message}，请尝试刷新页面！`,
            });
        });
        // 方便前端演示 暂时注释接口
        // setTimeout(() => {
        //   this.setState({width: '100%', data: project.data});
        // }, 2000);
    }

    _refresh = () => {
        const projectId = cache.getItem('projectId');
        request.get(`/project/info/${projectId}`).then((res) => {
            this.setState({data: res.data});
        });
    };
    updateData = (data, cb) => {
        Save.saveProject({
            ...this.state.data,
            projectJSON: data,
        }).then(() => {
            cb && cb();
        }).catch((err) => {
            Modal.error({title: '保存失败！', message: err.message});
        });
    };
    updateConfig = (data, cb) => {
        Save.saveProject({
            ...this.state.data,
            configJSON: data,
        }).then(() => {
            cb && cb();
        }).catch((err) => {
            Modal.error({title: '保存失败！', message: err.message});
        });
    };

    render() {
        const {width, data: {projectName, projectJSON, configJSON}, columnOrder} = this.state;
        let content;
        if (width !== '100%') {
            content = <div className='pdman-loading-content'>
                <div className='pdman-loading-content-img'>
                    <div style={{textAlign: 'center', marginTop: 100}}>
                        <div className='pdman-loading-content-logo'>{}</div>
                        <div className='pdman-loading-content-welcom'>
                            <span style={{fontSize: 35, fontWeight: 2, color: '#65B1F0'}}>WELCOME</span>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <span style={{fontSize: 35, fontWeight: 2, color: '#FFF'}}>ERD-ONLINE</span>
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

                        </div>
                    </div>
                </div>
            </div>;
        } else {
            content = <Home
                columnOrder={columnOrder}
                projectName={projectName}
                dataSource={projectJSON || {
                    modules: [],
                    dataTypeDomains: defaultData.profile.defaultDataTypeDomains,
                }}
                configJSON={configJSON}
                updateConfig={this.updateConfig}
                updateData={this.updateData}
                refresh={this._refresh}
            />;
        }

        return (
            <ErdLayout
                content={content}
                defaultSelectedKeys={['project']}
            />
        );
    }
}
