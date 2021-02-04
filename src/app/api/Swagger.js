import React from 'react';
import SwaggerLayout from "../layout/SwaggerLayout";
import {Menu} from "antd";
import UserOutlined from "@ant-design/icons/es/icons/UserOutlined";
import App from "../index";
import _object from "lodash/object";
import * as cache from "../../utils/cache";
import request from "../../utils/request";
import {Modal} from "../../components";
import * as Save from "../../utils/save";
import defaultData from "../defaultData";

export default class Swagger extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.dataSource || '',
            changeDataType: 'reset',
            columnOrder: [
                {code: 'chnname', value: '字段名', com: 'Input', relationNoShow: false},
                {code: 'name', value: '逻辑名(英文名)', com: 'Input', relationNoShow: false},
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
        const projectId = cache.getItem('projectId');
        request.get(`/project/info/${projectId}`).then((res) => {
            this.setState({width: '100%', data: res.data});
        }).catch((err) => {
            Modal.error({
                title: '打开项目失败！',
                message: `出错原因：${err.message}，请尝试刷新页面！`,
            });
        });
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
            this._refresh();
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
            this._refresh();
        }).catch((err) => {
            Modal.error({title: '保存失败！', message: err.message});
        });
    };

    _saveProject = (data, cb, dataHistory) => {
        // 保存项目
        this.updateData(data, () => {
            this.setState({
                dataSource: data || {},
                changeDataType: 'update',
                dataHistory,
            }, () => {
                cb && cb();
            });
        });
    };
    _getAllTableData = (dataSource) => {
        return (dataSource.modules || []).reduce((a, b) => {
            return a.concat((b.entities || []));
        }, []);
    };
    _saveProjectSome = (data, cb, dataHistory, type) => {
        // 保存部分数据
        const dataSource = this.state.data.projectJSON;
        const typeArray = type.split('/');
        let tempDataSource = {...dataSource};
        if (typeArray.length === 0) {
            // 修改模块
            tempDataSource = {
                ...dataSource,
                modules: (dataSource.modules || []).map((module) => {
                    if (module.name === typeArray[0]) {
                        return data;
                    }
                    return module;
                }),
            };
        } else if (typeArray.length === 2 && typeArray[1] === 'graphCanvas') {
            tempDataSource = {
                ...dataSource,
                modules: (dataSource.modules || []).map((module) => {
                    if (module.name === typeArray[0]) {
                        return {
                            ...module,
                            ...data,
                        };
                    }
                    return module;
                }),
            };
        } else if (typeArray.length === 3) {
            tempDataSource = {
                ...dataSource,
                modules: (dataSource.modules || []).map((module) => {
                    if (module.name === typeArray[0]) {
                        const changeEntity = (module.entities || [])
                            .filter(entity => entity.title === typeArray[2])[0];
                        const tempNodes = this._updateTableName(_object.get(module, 'graphCanvas.nodes', []), dataHistory);
                        const graphCanvas = {
                            ...(module.graphCanvas || {}),
                            nodes: tempNodes,
                        };
                        const entities = changeEntity ? (module.entities || []).map((entity) => {
                            if (entity.title === typeArray[2]) {
                                return data;
                            }
                            return entity;
                        }) : (module.entities || []).concat(data);
                        return {
                            ...module,
                            graphCanvas,
                            entities,
                            associations: this._getAssociations(graphCanvas, entities),
                        };
                    }
                    return module;
                }),
            };
            // 因为存在跨模块的情况，此处需要更新所有的连接线
            const newData = this._getAllTableData(tempDataSource);
            const oldData = this._getAllTableData(dataSource);
            tempDataSource = {
                ...tempDataSource,
                modules: (tempDataSource.modules || []).map((m) => {
                    const tempEdges = _object.get(m, 'graphCanvas.edges', []);
                    const tempNodes = _object.get(m, 'graphCanvas.nodes', []);
                    return {
                        ...m,
                        graphCanvas: {
                            ...(m.graphCanvas || {}),
                            edges: this._updateEdges(tempNodes, oldData, newData, tempEdges),
                        },
                    };
                }),
            };
        }
        this._saveProject(tempDataSource, cb, dataHistory);
    };
    _getAssociations = (data, entities = []) => {
        const edges = [...(data.edges || [])];
        const nodes = [...(data.nodes || [])];
        const tempAssociations = edges.map((edge) => {
            const sourceNode = nodes.filter(node => node.id === edge.source)[0];
            const targetNode = nodes.filter(node => node.id === edge.target)[0];
            const sourceEntity = sourceNode.title.split(':')[0];
            const targetEntity = targetNode.title.split(':')[0];
            const sourceEntityData = entities
                .filter(entity => entity.title === sourceEntity)[0] || sourceNode;
            const targetEntityData = entities
                .filter(entity => entity.title === targetEntity)[0] || targetNode;
            /*if (!sourceEntityData || !targetEntityData) {
              //Modal.error({title: '操作失败', message: '该数据表不存在，请先双击编辑保存再操作！', width: 350});
              return null;
            }*/
            const sourceFieldData = (sourceEntityData.fields || [])[parseInt(edge.sourceAnchor / 2, 10)];
            const targetFieldData = (targetEntityData.fields || [])[parseInt(edge.targetAnchor / 2, 10)];
            if (!sourceFieldData || !targetFieldData) {
                return null;
            }
            return {
                relation: edge.relation || '',
                from: {
                    entity: sourceEntity,
                    field: sourceFieldData.name,
                },
                to: {
                    entity: targetEntity,
                    field: targetFieldData.name,
                },
            };
        }).filter(association => !!association);
        const tempAssociationsString = [];
        return tempAssociations.filter((association) => {
            const stringData = `${association.from.entity}/${association.to.field}
      /${association.to.entity}/${association.from.field}`;
            if (!tempAssociationsString.includes(stringData)) {
                tempAssociationsString.push(stringData);
                return true;
            }
            return false;
        });
    };
    _getNodeData = (sourceId, targetId, data, nodes) => {
        const tempNodes = nodes.map((n) => {
            const table = data.filter(d => d.title === (n.copy || n.title.split(':')[0]))[0];
            return {
                ...n,
                title: (table && table.title) || n.title,
                fields: ((table && table.fields) || []).filter(f => !f.relationNoShow),
            };
        });
        let sourceNode, targetNode = null;
        for (let i = 0; i < tempNodes.length; i++) { // eslint-disable-line
            if (tempNodes[i].id === sourceId) {
                sourceNode = tempNodes[i];
            } else if (tempNodes[i].id === targetId) {
                targetNode = tempNodes[i];
            }
        }
        return {
            sourceNode,
            targetNode,
        };
    };
    _updateEdges = (nodes = [], oldData = [], data = [], edges = []) => {
        // 1.过滤掉属性不存在的连接线
        return edges.map((e) => {
            const sourceId = e.source;
            const targetId = e.target;
            const {sourceNode, targetNode} = this._getNodeData(sourceId, targetId, oldData, nodes);
            const sourceIndex = parseInt(e.sourceAnchor / 2, 10);
            const sourceField = sourceNode && sourceNode.fields[sourceIndex];
            const targetIndex = parseInt(e.targetAnchor / 2, 10);
            const targetField = targetNode && targetNode.fields[targetIndex];
            const newSourceNode = data.filter(d => d.title === (sourceNode && sourceNode.title))[0];
            const newTargetNode = data.filter(d => d.title === (targetNode && targetNode.title))[0];
            const newSourceIndex = ((newSourceNode && newSourceNode.fields) || [])
                .filter(f => !f.relationNoShow)
                .findIndex(f => f.name === (sourceField && sourceField.name));
            const newTargetIndex = ((newTargetNode && newTargetNode.fields) || [])
                .filter(f => !f.relationNoShow)
                .findIndex(f => f.name === (targetField && targetField.name));
            if (!sourceField || !targetField || (newSourceIndex < 0) || (newTargetIndex < 0)) {
                // 属性不存在了则需要移除
                return null;
            }
            return {
                ...e,
                sourceAnchor: sourceIndex === newSourceIndex ? e.sourceAnchor : newSourceIndex * 2,
                targetAnchor: targetIndex === newTargetIndex ? e.targetAnchor : newTargetIndex * 2,
            };
        }).filter(e => !!e);
    };
    _updateTableName = (data = [], dataHistory = {}) => {
        // 将旧表名，替换到新表名
        return data.map((node) => {
            const titleArray = node.title.split(':');
            if (dataHistory.oldName === titleArray[0]) {
                return {
                    ...node,
                    title: `${dataHistory.newName}${titleArray[1] ? `:${titleArray[1]}` : ''}`,
                };
            }
            return node;
        });
    };

    render() {
        const { data, columnOrder} = this.state;
        console.log(282,data)
        if (!data) {
            Modal.error({title: '打开项目失败', message: "无法加载项目信息，请刷新后重试"});
            return;
        }
        const {projectName, projectJSON, configJSON} = data;

        const content =
            <div
                className='erd-home-other-content'
            >
                <App
                    changeDataType={this.state.changeDataType}
                    dataSource={projectJSON || {
                        modules: [],
                        dataTypeDomains: defaultData.profile.defaultDataTypeDomains,
                    }}
                    project={projectName}
                    saveProject={this._saveProject}
                    dataHistory={this.state.dataHistory}
                    saveProjectSome={this._saveProjectSome}
                    columnOrder={columnOrder}
                    updateData={this.updateData}
                    refresh={this._refresh}
                    configJSON={configJSON}
                    updateConfig={this.updateConfig}
                />
            </div>
        ;

        return (
            <SwaggerLayout
                content={content}
                defaultSelectedKeys={['role']}
            />
        );
    }
}

