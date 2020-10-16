import React from 'react';
import ReactDom from 'react-dom';
import G6 from '@antv/g6';
import _object from 'lodash/object';
import { Context, openModal, Icon, Modal } from '../../../components';
import RelationEdit from './RelationEdit';
import { writeFile } from '../../../utils/json';
import './style/index.less';
import { uuid } from '../../../utils/uuid';

/* eslint-disable */
G6.track(false);

export default class Relation extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      empty: false,
      contextDisplay: 'none',
      contextMenus: [],
      count: 1,
    };
    this.table = [];
    this.graphCanvas = this._getData(props.dataSource);
    //this.relations = [];
  }
  componentDidMount(){
    const { height, dataSource, width } = this.props;
    const data = this.graphCanvas;
    this._checkEmpty(data);
    this._renderRelation(height, width, data, dataSource);
    this.pointerDom = ReactDom.findDOMNode(this.pointer);
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.height !== this.props.height ||
      nextProps.width !== this.props.width ||
      nextProps.dataSource !== this.props.dataSource) {
      this.net.changeSize(nextProps.width, nextProps.height);
      if (nextProps.dataSource !== this.props.dataSource) {
        //console.log(nextProps.dataHistory);
        if (nextProps.changeDataType === 'reset') {
          // 1.刷新数据源，则所有的数据进行重置
          const newGraphCanvas = this._getData(nextProps.dataSource);
          this.graphCanvas = {
            edges: newGraphCanvas.edges,
            nodes: this._updateTableName(newGraphCanvas.nodes, nextProps.dataHistory),
          };
          this.table = [];
        } else {
          // 2.修改数据源造成的数据更新，则不需要所有的数据重置
          // 2.1.保存绘图数据，然后重新绘制
          const source = this.net.save().source;
          const newNodes = this._updateNodes(nextProps.dataSource,
            this._updateTableName(this.newNodes || source.nodes, nextProps.dataHistory));
          this.graphCanvas = this._clearInvalidData({
            edges: this._updateEdges(source.nodes, newNodes, source.edges),
            nodes: newNodes,
          }, nextProps.dataSource);
          this.table = this._updateTableName(this.table, nextProps.dataHistory);
          this.newNodes = null;
        }
        // 重新渲染界面
        /*const dom = document.getElementById(`paint-${this.props.value}`);
        if (dom && dom.children) {
          Array.from(dom.children).forEach((child) => {
            dom.removeChild(child);
          });
        }
        this._renderRelation(nextProps.height,
          nextProps.width, this.graphCanvas, nextProps.dataSource);*/
        this.net.changeData({...this.graphCanvas});
      } else {
        this.net.changeSize(nextProps.width, nextProps.height);
      }
    }
  }
  componentWillUnmount(){
  }
  onZoom = (zoom) => {
    let scale = this.net.getScale();
    if (zoom === 'add' && scale >= 0 && scale <= 9.8) {
      scale = Math.round(parseFloat(scale + 0.2) * 100) / 100;
    }
    if (zoom === 'sub' && scale <= 10 && scale >= 0) {
      scale = Math.round(parseFloat(scale - 0.2) * 100) / 100;
    }
    if (zoom === 'normal') {
      scale = 1;
    }
    this._zoomTree(scale);
  };
  /* eslint-disable */
  _addCountTableName = (name, title) => {
    const titleNumber = title.split(':')[1];
    if (name.includes(':')) {
      return name;
    } else if (titleNumber) {
      return `${name}:${titleNumber}`;
    }
    return name;
  };
  _getTableNameByNameTemplate = (entity, title) => {
    let tempName = title;
    if (entity) {
      const nameTemplate = entity.nameTemplate || '{code}[{name}]';
      if (!nameTemplate) {
        tempName = entity.chnname || entity.title;
      } else {
        tempName = nameTemplate.replace(/\{(\w+)\}/g, (match, key) => {
          let tempKey = key;
          if (tempKey === 'code') {
            tempKey = 'title';
          } else if (tempKey === 'name') {
            tempKey = 'chnname';
          }
          return entity[tempKey];
        }) || entity.title;
      }
    }
    return this._addCountTableName(tempName, title);
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
  _getAssociations = (data, module) => {
    const edges = [...(data.edges || [])];
    const nodes = [...(data.nodes || [])];
    const entities = (module.entities || []);
    const tempAssociations = edges.map((edge) => {
      const sourceNode = nodes.filter(node => node.id === edge.source)[0];
      const targetNode = nodes.filter(node => node.id === edge.target)[0];
      const sourceEntity = sourceNode.title.split(':')[0];
      const targetEntity = targetNode.title.split(':')[0];
      const sourceEntityData = entities
        .filter(entity => entity.title === sourceEntity)[0] || sourceNode;
      const targetEntityData = entities
        .filter(entity => entity.title === targetEntity)[0] || targetNode;
      const sourceFieldData = (sourceEntityData.fields || []).filter(f => !f.relationNoShow)
        [parseInt(edge.sourceAnchor / 2, 10)];
      const targetFieldData = (targetEntityData.fields || []).filter(f => !f.relationNoShow)
        [parseInt(edge.targetAnchor / 2, 10)];
      if (!sourceFieldData || !targetFieldData) {
        return null;
      }
      return {
        relation: edge.relation || '0,n:1',
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
  _filterFieldsAndCopy = (graphCanvas) => {
    return {
      ...graphCanvas,
      edges: this._updateEdges(graphCanvas.nodes, graphCanvas.nodes, graphCanvas.edges),
      nodes: (graphCanvas.nodes || [])
        .map(node => ({..._object.omit(node,
            ['fields', 'headers', 'datatype', 'associations', 'realName', 'edges'])})),
    };
  };
  searchNodes = (value) => {
    const nodes = this.net.getNodes();
    nodes.forEach(node => {
      const realName = _object.get(node, '_attrs.model.realName', '').toLocaleLowerCase();
      if (value && realName.includes(value.toLocaleLowerCase())) {
        this.net.update(node, {
          color: 'yellow',
        });
      } else {
        let color = '#353B47';
        if (realName.includes(':')) {
          color = '#5D616A';
        }
        this.net.update(node, {
          color
        });
      }
    });
    //this.net.refresh();
  };
  promiseSave = () => {
    return new Promise((res) => {
      this.saveData(() => {
        res();
      });
    });
  };
  getNodes = () => {
    return this.net.getNodes().map(n => _object.get(n, '_attrs.model'));
  };
  setNodes = (nodes) => {
    this.newNodes = nodes;
  };
  exportImg = (path, type, callback) => {
    const { value } = this.props;
    const tempNet = this.net;
    const currentDom = document.getElementById(`paint-${value}`);
    const currentStyle = getComputedStyle(currentDom);
    let tempDom = null;
    let tempWidth = '';
    let tempHeight = '';
    let fitView = undefined;
    if (type === 'all') {
      fitView = 'autoSize';
      tempWidth = 2000;
      tempHeight = 2000;
    } else {
      tempWidth = currentStyle.width && currentStyle.width.split('px')[0];
      tempHeight = currentStyle.width && currentStyle.height.split('px')[0];
    }
    // 1.创建一个临时的dom节点
    const id = uuid();
    tempDom = document.createElement('div');
    tempDom.setAttribute('id', id);
    tempDom.style.width = `${tempWidth}px`;
    tempDom.style.height = `${tempHeight}px`;
    document.body.appendChild(tempDom);
    // 2.缓存当前的net对象
    const dataSource = this.net.save().source;
    // 3.渲染新的关系图
    this._renderRelation(tempWidth,
      tempHeight, dataSource,
      null, id, fitView,
      true, true);
    setTimeout(() => {
      const tempGraphContainer = this.net.get('graphContainer');
      // 关闭缩略图
      this._keyDown({key: 'm'}, true);
      const imageType = path.endsWith('.jpg') ? 'jpg' : 'png';
      html2canvas(tempGraphContainer).then(canvas => {
        const dataBuffer = Buffer.from(canvas.toDataURL(`image/${imageType}`).replace(/^data:image\/\w+;base64,/, ""), 'base64');
        writeFile(path, dataBuffer).then(() => {
          callback && callback(path);
          this.net = tempNet;
          tempDom && tempDom.parentNode.removeChild(tempDom);
        });
      });
    });
  };
  saveData = (callBack) => {
    this.graphCanvas = this.net.save().source;
    const { saveProjectSome, project, dataSource, value } = this.props;
    let tempData = this._filterFieldsAndCopy(this.graphCanvas);
    tempData = this._clearInvalidData(tempData, dataSource);
    const moduleName = value.split('map&')[1].split('/')[0];
    const module = (dataSource.modules || []).filter(mo => mo.name === moduleName)[0];
    saveProjectSome(`${project}.pdman.json`, {
      associations: this._getAssociations(this.graphCanvas, module),
      graphCanvas: {...tempData}}, () => {
      callBack && callBack();
    }, undefined, `${moduleName}/graphCanvas`);
  };
  undo = () => {
    //this.net.undo();
  };
  redo = () => {
    //this.net.redo();
  };
  del = (item) => {
    this.net.remove(item);
  };
  paste = () => {
    this.net.paste();
  };
  copy = () => {
    this.net.copy();
  };
  changeMode = (mode) => {
    this.net.changeMode(mode);
  };
  _checkEmpty = (data) => {
    if (_object.get(data, 'nodes', []).length === 0 && _object.get(data, 'edges', []).length === 0) {
      this.setState({
        empty: true,
      });
    } else {
      this.setState({
        empty: false,
      });
    }
  };
  _updateEdges = (oldNodes = [], newNodes = [], edges = []) => {
    // 1.过滤掉属性不存在的连接线
    return edges.map((e) => {
      const sourceId = e.source;
      const targetId = e.target;
      const sourceNode = oldNodes.filter(n => n.id === sourceId)[0];
      const targetNode = oldNodes.filter(n => n.id === targetId)[0];
      const sourceIndex = parseInt(e.sourceAnchor / 2, 10);
      const sourceField = sourceNode && sourceNode.fields && sourceNode.fields[sourceIndex];
      const targetIndex = parseInt(e.targetAnchor / 2, 10);
      const targetField = targetNode && targetNode.fields && targetNode.fields[targetIndex];
      const newSourceNode = newNodes.filter(n => n.id === sourceId)[0];
      const newTargetNode = newNodes.filter(n => n.id === targetId)[0];
      const newSourceIndex = (newSourceNode && newSourceNode.fields || [])
        .findIndex(f => f.name === (sourceField && sourceField.name));
      const newTargetIndex = (newTargetNode && newTargetNode.fields || [])
        .findIndex(f => f.name === (targetField && targetField.name));
      if (!sourceField || !targetField || (newSourceIndex < 0) || (newTargetIndex < 0)) {
        // 属性不存在了则需要移除
        return null;
      } else {
        // 更新坐标
        return {
          ...e,
          sourceAnchor: sourceIndex === newSourceIndex ? e.sourceAnchor : newSourceIndex * 2,
          targetAnchor: targetIndex === newTargetIndex ? e.targetAnchor : newTargetIndex * 2,
        }
      }
    }).filter(e => !!e);
  };
  _updateNodes = (dataSource, nodes) => {
    const { value } = this.props;
    // 第三步：设置数据
    const moduleName = value.split('map&')[1].split('/')[0];
    const module = _object.get(dataSource, 'modules', []).filter(mo => mo.name === moduleName)[0];
    const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    // 需要对箭头进行处理，如果某个字段不存在了，或者不显示了，则需要清除该字段对应的箭头线
    const allDataTable = this._getAllTableData(dataSource);
    const associations = _object.get(module, 'associations', []);
    return nodes.map((node) => {
      const dataTable = allDataTable
        .filter(entity => entity.title === (node.copy || node.title.split(':')[0]))[0];
      const fields = _object.get(dataTable, 'fields', []);
      return {
        ...node,
        datatype,
        realName: this._getTableNameByNameTemplate(dataTable, node.title),
        associations,
        headers: this._initColumnOrder(dataTable),
        fields: fields.filter(field => !field.relationNoShow),
      };
    });
  };
  _getData = (dataSource) => {
    const { value } = this.props;
    // 第三步：设置数据
    const moduleName = value.split('map&')[1].split('/')[0];
    const module = _object.get(dataSource, 'modules', []).filter(mo => mo.name === moduleName)[0];
    const data = this._clearInvalidData(_object.get(module, 'graphCanvas', {}), dataSource);
    const associations = _object.get(module, 'associations', []);
    const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    return {
      ...data,
      nodes: [...(data.nodes || [])].map((node) => {
        const dataTable = this._getAllTableData(dataSource)
          .filter(entity => entity.title === (node.copy || node.title.split(':')[0]))[0];
        return {
          ...node,
          realName: this._getTableNameByNameTemplate(dataTable, node.title),
          datatype,
          associations,
          headers: this._initColumnOrder(dataTable),
          fields: _object.get(dataTable, 'fields', [])
            .filter(field => !field.relationNoShow),
          edges: [...(data.edges || [])],
        };
      }),
    };
  };
  _initColumnOrder = (dataTable) => {
    // 初始化列的顺序、列在关系图中的显示
    // 返回原引用，否则会影响后续的引用比较
    const { columnOrder } = this.props;
    const headers = (dataTable && dataTable.headers || []);
    const headerNames = headers.map(header => header.fieldName);
    // 1.获取当前表的列，检查是否完整并补充
    columnOrder.forEach((column) => {
      if (!headerNames.includes(column.code)) {
        headers.push({
          fieldName: column.code,
          relationNoShow: column.relationNoShow,
        });
      }
    });
    return headers.filter(header => (!header.relationNoShow) && (header.fieldName !== 'relationNoShow'));
  };
  _clearInvalidData = (data, dataSource) => {
    //const { value } = this.props;
    //const moduleName = value.split('map&')[1].split('/')[0];
    const tables = this._getAllTable(dataSource, []);
    const tempNodes = (data.nodes || []).filter(node => tables.includes(node.title.split(':')[0]));
    const tempNodesId = tempNodes.map(node => node.id);
    const tempEdges = (data.edges || []).filter(edge =>
      tempNodesId.includes(edge.source) && tempNodesId.includes(edge.target));
    return {
      nodes: tempNodes,
      edges: tempEdges,
    };
  };
  _checkTableName = (title, titles) => {
    if (titles.includes(title)) {
      return this._checkTableName(`${title}1`, titles);
    }
    return title;
  };
  _getDefaultDataType = (type) => {
    const { dataSource } = this.props;
    const database = _object.get(dataSource, 'dataTypeDomains.database', []);
    const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    const defaultDatabase = database.filter(db => db.defaultDatabase)[0];
    const dbCode = defaultDatabase.code || database[0].code || '';
    if (dbCode) {
      const current = datatype.filter(dt => dt.code === type)[0] || {};
      const apply = current.apply || {};
      return (apply[dbCode] && apply[dbCode].type) || '';
    }
    return '';
  };
  _getActivePointerPosition = (x, y) => {
    // 获取所有选中的边
    let clickPoint = null;
    let pointerIndex = -1;
    const activeEdge = (this.net.getEdges() || []).filter(edge => edge._attrs.actived)[0];
    // 获取鼠标所在的位置
    if (activeEdge) {
      // 将该边的所有锚点的距离进行计算，算出当初点击的锚点
      const controlPoints = (activeEdge._attrs.model.controlPoints || []).map((point, index) => {
        return {
          index,
          distance: (point.x - x) * (point.x - x)
          + (point.y - y) * (point.y - y),
        };
      });
      // 找出该锚点
      pointerIndex = activeEdge._attrs.model.controlPoints
        .findIndex((point, index) => controlPoints[index].distance < 15);
      if (pointerIndex > 0 &&
        (pointerIndex !== (activeEdge._attrs.model.controlPoints || []).length - 1)) {
        clickPoint = (activeEdge._attrs.model.controlPoints || [])[pointerIndex];
      }
    }
      return clickPoint;
  };
  _renderRelation = (paintHeight, paintWidth, data, dataSource, id, fitView, disableGrid, disableMap) => {
    const Util = G6.Util;
    const getDefaultDataType = this._getDefaultDataType;
    /* eslint-disable */

    const miniMap = new G6.Plugins['tool.minimap']({
      width: 180,
      height: 180,
    });
    G6.registEdge('erdRelation', {
        stroke: '#666',
        getShorterPath: function(sA, tA, box, isCross){
          let margin = 10;
          let topDistance,bottomDistance;
          let shorter = 0;

          let path = [];

          if(isCross){
            topDistance = box.minY-margin - tA.y;
            bottomDistance = box.maxY+margin - tA.y;
            let isTop = (Math.abs(topDistance)<Math.abs(bottomDistance))?true:false;
            if(isTop){
              shorter = box.minY-margin - sA.y;
            }else{
              shorter = box.maxY+margin - sA.y;
            }
          }

          return shorter;

        },
        getPath: function(cfg, group, s, t) {
          let shorten = 24
              ,sBox = s.getBBox()
              ,tBox = t.getBBox()
              ,points = cfg.points
              ,s1 = points[0]
              ,t1 = points[points.length - 1];

          // 箭头方向
          let sPosition = (sBox.minX == s1.x)?-1:1;
          let tPosition = (tBox.minX == t1.x)?-1:1;

          // 根据箭头重新固定起点
          let s2 = {'x':s1.x+sPosition*shorten, 'y':s1.y};
          let t2 = {'x':t1.x+tPosition*shorten, 'y':t1.y};


          let gapX = t2.x-s2.x;
          let gapY = t2.y-s2.y;

          // 判断线条有没有穿过表
          let sIsCross = sPosition * gapX < 0;
          let tIsCross = -tPosition * gapX < 0;

          let path = [['M', s1.x, s1.y]];
          path.push(['L', s2.x, s2.y]);
          let ctrlPoints = cfg.origin.controlPoints;
          if(ctrlPoints && ctrlPoints.length > 2){
            for (var i = 1; i < ctrlPoints.length - 1; i++) {
              path.push(['L', ctrlPoints[i].x,ctrlPoints[i].y]);
            }
          }else{
            let sY = this.getShorterPath(s2,t2,sBox,sIsCross);
            let tY = this.getShorterPath(t2,s2,tBox,tIsCross);
            if(sY != 0 && tY != 0){

            }
            if(gapX > 0){
              // source锚点在左
              if(sY != 0){
                path.push(['L', s2.x, s2.y+sY]);
              }
              path.push(['L', s2.x+gapX/2, s2.y+sY]);
              path.push(['L', t2.x-gapX/2, t2.y+tY]);
              if(tY != 0){
                path.push(['L', t2.x, t2.y+tY]);
              }
            }else{
              // source锚点在右
              path.push(['L', s2.x, s2.y+gapY/2]);
              path.push(['L', t2.x, t2.y-gapY/2]);
            }
          }


          path.push(['L', t2.x, t2.y]);
          path.push(['L', t1.x, t1.y]);
          return path;

        },
        afterDraw: function(cfg, group, keyShape) {
          cfg.origin.relation = cfg.origin.relation || '0,n:1';
          var points = cfg.points;
          var s1 = points[0];
          var e1 = points[points.length - 1];
          var s2 = keyShape.getPoint(0.01);
          var e2 = keyShape.getPoint(0.99);

          const r = 4;
          const x = -15;
          const y = 0;
          var relationArrow = {
            '0,1' : {
              attrs:{
                x: 0,
                y: 0,
                path: 'M'+x+','+(y-r) +
                    'a '+r+','+r+',0,1,1,0,'+(2*r)+
                    'a '+r+','+r+',0,1,1,0,'+(-2*r)+
                    'M '+(x+r+1)+','+(r+1)+
                    'L '+(x+r+1)+','+(-r-1)+
                    'M '+(x+r+1)+',0'+
                    'L 0,0'+
                    'z',

                stroke: this.stroke,
                fill:'#fff'
              },
              class: 'arrow',
              zIndex: 10
            },
            '0,n' : {
              attrs:{
                x: 0,
                y: 0,
                path: 'M'+x+','+(y-r) +
                    'a '+r+','+r+',0,1,1,0,'+(2*r)+
                    'a '+r+','+r+',0,1,1,0,'+(-2*r)+
                    'M '+(x+r+1)+','+(r+1)+
                    'L '+(x+r+1)+','+(-r-1)+
                    'M '+(x+r+1)+','+y+
                    'L '+y+',-'+r+
                    'M '+(x+r+1)+','+y+
                    'L '+y+','+r+
                    'M '+(x+r+1)+',0'+
                    'L 0,0'+
                    'z',

                stroke: this.stroke,
                fill:'#fff'
              },
              class: 'arrow',
              zIndex: 10
            },
            '1' : {
              attrs:{
                x: 0,
                y: 0,
                path: 'M '+(x+r+1)+','+(r+1)+
                    'L '+(x+r+1)+','+(-r-1)+
                    'M '+(x+r+1)+',0'+
                    'L 0,0'+
                    'z',

                stroke: this.stroke,
                fill:'#fff'
              },
              class: 'arrow',
              zIndex: 10
            },
            '1,n' : {
              attrs:{
                x: 0,
                y: 0,
                path: 'M '+(x+r+1)+','+(r+1)+
                    'L '+(x+r+1)+','+(-r-1)+
                    'M '+(x+r+1)+','+y+
                    'L '+y+',-'+r+
                    'M '+(x+r+1)+','+y+
                    'L '+y+','+r+
                    'M '+(x+r+1)+',0'+
                    'L 0,0'+
                    'z',

                stroke: this.stroke,
                fill:'#fff'
              },
              class: 'arrow',
              zIndex: 10
            },
            '0' : {
              attrs:{
                x: 0,
                y: 0,
                path: 'M'+x+','+(y-r) +
                  'a '+r+','+r+',0,1,1,0,'+(2*r)+
                  'a '+r+','+r+',0,1,1,0,'+(-2*r),
                stroke: this.stroke,
                fill:'#fff'
              },
              class: 'arrow',
              zIndex: 10
            },
          };
          if(cfg.origin.relation){
            var relation = cfg.origin.relation.split(':');
            if(relation.length == 2 && s2){
              var startArrow = group.addShape('path', relationArrow[relation[0]]);
              G6.Util.arrowTo(startArrow, s1.x, s1.y, s2.x, s2.y, s1.x, s1.y);
              var endArrow = group.addShape('path', relationArrow[relation[1]]);
              G6.Util.arrowTo(endArrow, e1.x, e1.y, e2.x, e2.y, e1.x, e1.y);
            }

          }
        }
    });


    G6.registerNode('table', {
      draw(cfg, group){
        const x = cfg.x;
        const y = cfg.y;
        const model = cfg.model;
        const fields = model.fields || [];
        const l = fields.length;
        const headers = model.headers || [];
        const realWidth = (cfg.size && cfg.size[0]) || model.width;
        const realHeight = (cfg.size && cfg.size[1]) || model.height;
        const padding = 6;
        const datatype = model.datatype || [];
        const associations = model.associations || [];
        const currentFromEntities = associations.filter(ass => ass.to && ass.from.entity === model.title.split(':')[0]);
        const headerGroup = {};
        const headerBox = {};
        // 初始化整个图形
        const backRect = group.addShape('rect', {
          attrs: {
            stroke: 'blue',
            fill: model.moduleName ? '#5D616A': cfg.color,
          },
        });
        // 按顺序初始化列名
        headers.forEach((header) => {
          if (group) {
            headerGroup[header.fieldName] = group.addGroup();
          }
        });
        let fontHeight;
        let anchorPoints = [];
        let title;
        let titleBox;
        let width;
        let height;
        let splitLine;

        title = group.addShape('text', {
          attrs: {
            x: 0,
            y: 0,
            text: model.moduleName ? `<<${model.moduleName}>> ${model.realName}` : model.realName,
            fill: '#1D95E2',
            textBaseline: 'top',
            textAlign: 'center',
          },
        });

        splitLine = group.addShape('line', {
          attrs: {
            stroke: '#4D5157',
          },
        });
        const getTitle = (field, fieldName) => {
          if (fieldName === 'pk') {
            const pkTitles = [];
            if (field[fieldName]) {
              pkTitles.push('PK');
            }
            if (currentFromEntities.some(entity => entity.from.field === field.name)) {
              // 该属性为外键
              pkTitles.push('FK');
            }
            return pkTitles.length > 0 ? `<${pkTitles.join(',')}>` : '';
          } else if (fieldName === 'type' && field[fieldName]) {
            const currType = datatype.filter(type => type.code === field[fieldName])[0];
            return (currType && currType.name) || field[fieldName];
          } else if (fieldName === 'dataType') {
            return getDefaultDataType(field.type);
          }
          return field[fieldName] || '';
        };
        const getTitleColor = (field) => {
          if (field.pk) {
            return '#C2A412';
          } else if (currentFromEntities.some(entity => entity.from.field === field.name)) {
            return '#8F9C6D';
          }
          return '#C5C6C5';
        };
        titleBox = title.getBBox();
        const realLineHeight = (realHeight && ((realHeight - titleBox.height) / l)) || 20;
        const lineHeight = realLineHeight < 13 ? 13 : realLineHeight;
        Util.each(fields, (field, i) => {
          // 绘制每一行
          Object.keys(headerGroup).forEach((fieldName) => {
            headerGroup[fieldName].addShape('text', {
              attrs:{
                x: x,
                y: y + lineHeight * i,
                text: getTitle(field, fieldName),
                fill: getTitleColor(field),
                textBaseline: 'top',
              },
            });
            if (field.pk) {
              const box = headerGroup[fieldName].getBBox();
              headerGroup[fieldName] && headerGroup[fieldName].addShape('line', {
                attrs: {
                  x1: box.minX,
                  y1: box.maxY + 3,
                  x2: box.maxX,
                  y2: box.maxY + 3,
                  stroke: '#C2A412',
                },
              });
            }
          });
        });
        // 按顺序初始化列Box
        headers.forEach((header) => {
          headerBox[header.fieldName] = headerGroup[header.fieldName].getBBox();
        });
        // 计算图形的宽高
        // 所有列的宽度之和
        const allHeaderWidth = Object.keys(headerBox).reduce((a, b) => {
          return a + headerBox[b].width;
        }, 0);
        // 加上右边距
        const offsetRight = ((realWidth || allHeaderWidth) - allHeaderWidth) / headers.length;
        const marginRight = offsetRight < 0 ? 10 : offsetRight + 10;
        width = allHeaderWidth + Object.keys(headerBox).length * marginRight + 2 * padding;
        if (Object.keys(headerBox).length === 0) {
          // 新建表的时候需要有一个默认宽度
          width = titleBox.width;
        }
        width = Math.max(titleBox.width, width);
        height = Math.max(...Object.keys(headerBox).map(header => headerBox[header].height))
          + 4 * padding + titleBox.height;
        // 获取每一行的高度
        const firstGroup = headerGroup[Object.keys(headerGroup)[0]];
        fontHeight = firstGroup &&
          firstGroup.get('children')[0] &&
          firstGroup.get('children')[0].getBBox().height || 13;
        title.translate(0, -height / 2 + padding);
        // 调整每一列的位置
        let boxWidth = 0;
        Object.keys(headerGroup).forEach((header) => {
          // 根据顺序进行宽度叠加
          headerGroup[header].translate(-width / 2 + boxWidth + padding,
            -height / 2 + titleBox.height + 3 * padding);
          boxWidth += headerBox[header].width + marginRight;
        });
        splitLine.attr({
          x1: cfg.x - width / 2,
          y1: cfg.y - height / 2 + 2 * padding + titleBox.height,
          x2: cfg.x + width / 2,
          y2: cfg.y - height / 2 + 2 * padding + titleBox.height,
        });
        /* eslint-disable */
        backRect.attr({
          x: x - (!isFinite(width) ? titleBox.width : width / 2),
          y: y - (!isFinite(height) ? titleBox.height / 2 : height / 2),
          width:  (!isFinite(width) ? titleBox.width * 2  : width),
          height: (!isFinite(height) ? titleBox.height * 2 : height),
        });
        const firstBox = headerBox[Object.keys(headerBox)[0]];
        Util.each(fields, (field, i) => {
          const r = (titleBox.height + i * (firstBox.height + lineHeight - fontHeight) / l
            + fontHeight / 2 + 3 * padding) / height;
          anchorPoints.push([0, r]);
          anchorPoints.push([1, r]);
        });
        group.set('anchorPoints', anchorPoints);
        return backRect;
      },
      getAnchorPoints(cfg, group){
        //const anchorPoints = group.get('anchorPoints');
        //anchorPoints.unshift([0.5, 0]);   // 上中
        //anchorPoints.push([0.5, 1]);      // 下中
        return group.get('anchorPoints');
      },
    });
    this.net = new G6.Net({
      id: id || `paint-${this.props.value}`,      // 容器ID
      height: paintHeight - 20,
      width: paintWidth,
      mode: 'edit',
      fitView: fitView,
      plugins: disableMap ? [] : [miniMap],
      grid: disableGrid ? null : {
        forceAlign: true, // 是否支持网格对齐
        cell: 10,         // 网格大小
        line: {         // 网格线样式
          stroke: '#D4D4D4',
          opacity: 0.5
        },
      },
    });
    this.net.on('click', (e) => {
      this.pointerDom.style.display = 'none';
      this.setState({
        contextDisplay: 'none',
      });
      if (e.itemType === 'edge') {
        // 判断是否选中了锚点
        // 通过给锚点增加遮罩
        const pointer = this._getActivePointerPosition(e.x, e.y);
        if (pointer) {
          const domPosition = this.net.converPoint(pointer);
          this.pointerDom.style.display = 'block';
          this.pointerDom.style.top = `${domPosition.y - 3}px` ;
          this.pointerDom.style.left = `${domPosition.x - 3}px`;
        }
        this.clickEdgeX = e.x;
        this.clickEdgeY = e.y;
        this.clickEdge = e.item;
      } else {
        this.clickEdge = null;
        this.domX = e.domX;
        this.domY = e.domY;
      }
    /*  if (e.domEvent.ctrlKey) {
        if (this.net._attrs.mode === 'edit') {
          const { modeChange } = this.props;
          //this.net.changeMode('drag');
          modeChange && modeChange('drag');
        } else {
          const { modeChange } = this.props;
          //this.net.changeMode('edit');
          modeChange && modeChange('edit');
        }
      }*/
    });
    this.net.on('mousewheel', () => {
      this.pointerDom.style.display = 'none';
      this.setState({
        count: this.net.getScale().toFixed(1)
      })
    });
    this.net.on('afterrender', () => {
      const { value, dataSource } = this.props;
      const data = this.net.save().source;
      const moduleName = value.split('map&')[1].split('/')[0];
      const module = (dataSource.modules || []).filter(mo => mo.name === moduleName)[0];
      this.net.changeData({
        ...data,
        nodes: (data.nodes || []).map((node) => ({
          ...node,
          associations: this._getAssociations(data, module)
        }))
      });
    });
    this.net.on('dblclick', (ev) => {
      if (this.net._attrs.mode === 'edit') {
        const { openTab } = this.props;
        if (ev.itemType === 'node') {
          const title = ev.item._attrs.model.title.split(':')[0];
          const module = ev.item._attrs.model.moduleName;
          const moduleName = this.props.value.split('map&')[1].split('/')[0];
          openTab && openTab(`entity&${module || moduleName}&${title}`);
          /*openModal(<Table
            value={`entity&${moduleName}&${title}`}
            dataSource={this.props.dataSource}
            project={project}
            saveProjectSome={saveProjectSome}
            updateTabs={updateTabs}
            copy={ev.item._attrs.model.copy}
            id={ev.item._attrs.id}
            columnOrder={this.props.columnOrder}
          />, {
            title: '编辑数据表',
            modality: true,
            autoFocus: true,
            onOk: (modal, com) => {
              const allTable = this._getAllTable(this.props.dataSource);
              if (com.getName() !== title && allTable.includes(com.getName())) {
                Modal.error({title: '保存失败', message: '该数据表已经存在！', width: 200})
              } else {
                com.save((err) => {
                  if (!err) {
                    modal.close();
                  } else {
                    Modal.error({title: '保存失败', message: '保存失败', width: 100})
                  }
                });
              }
            }
          })*/
        }
      }
    });
    let dragging = false;
    this.net.on('dragstart', (e) => {
      dragging = true;
    });
    this.net.on('dragmove', (e) => {
      if (this.pointerDom.style.display !== 'none') {
        this.pointerDom.style.top = `${e.domY - 3}px` ;
        this.pointerDom.style.left = `${e.domX - 3}px`;
      }
    });
    this.net.on('dragend', (ev) => {
      dragging = false;
      this.pointerDom.style.display = 'none';
      if (ev.shape && ev.shape.hasClass('anchor-point')) {
        setTimeout(() => {
          const { value, dataSource } = this.props;
          const data = this.net.save().source;
          const moduleName = value.split('map&')[1].split('/')[0];
          const module = (dataSource.modules || []).filter(mo => mo.name === moduleName)[0];
          this.net.changeData({
            ...data,
            nodes: (data.nodes || []).map((node) => ({
              ...node,
              associations: this._getAssociations(data, module)
            }))
          });
        }, 1);
      }
    });
// 进入锚点切换到曲线添加模式
    this.net.on('mouseenter', (ev) => {
      let shape = ev.shape;
      if(shape && shape.hasClass('anchor-point') && !dragging) {
        this.net.beginAdd('edge', {
          shape: 'erdRelation',
          relation: '0,n:1'
        });
      }
    });
// 离开锚点切换回编辑模式
    this.net.on('mouseleave', (ev) => {
      let shape = ev.shape;
      if(shape && shape.hasClass('anchor-point') && !dragging) {
        this.net.changeMode('edit');
      }
    });
    this.net.on('keydown', (ev) => {
      // 37 38 39 40
      // 找出当前激活的item;
      if (ev.keyCode > 36 && ev.keyCode < 41) {
        const { count } = this.state;
        const activeNodes = (this.net.getNodes() || []).filter(node => node._attrs.actived);
        activeNodes.forEach(activeNode => {
          this.net.hideAnchor(activeNode);
          const cfg = activeNode.getModel();
          const x = cfg.x;
          const y = cfg.y;
          if (ev.keyCode === 37) {
            this.net.update(activeNode, {
              ...activeNode._attrs.model,
              x: x - (10 / count),
              y: y,
            })
          } else if (ev.keyCode === 38) {
            this.net.update(activeNode, {
              ...activeNode._attrs.model,
              x: x,
              y: y - (10 / count),
            })
          } else if (ev.keyCode === 39) {
            this.net.update(activeNode, {
              ...activeNode._attrs.model,
              x: x + (10 / count),
              y: y,
            })
          } else if (ev.keyCode === 40) {
            this.net.update(activeNode, {
              ...activeNode._attrs.model,
              x: x,
              y: y + (10 / count),
            })
          }
          // 先隐藏后显示防止锚点与节点位置不一致
          this.net.showAnchor(activeNode);
        });
        // 获取所有选中的边 或者是上次选中的边
        const activeEdge = (this.net.getEdges() || []).filter(edge => edge._attrs.actived)[0] || this.clickEdge;
        // 获取鼠标所在的位置
        if (activeEdge) {
          let clickPoint = -1;
          // 将该边的所有锚点的距离进行计算，算出当初点击的锚点
          const controlPoints = activeEdge._attrs.model.controlPoints.map((point, index) => {
            return {
              index,
              distance: (point.x - this.clickEdgeX) * (point.x - this.clickEdgeX)
              + (point.y - this.clickEdgeY) * (point.y - this.clickEdgeY)
            };
          });
          // 找出该锚点对应的索引
          clickPoint = activeEdge._attrs.model.controlPoints.findIndex((point, index) => controlPoints[index].distance < 15);
          // 根据按下的方向键，更新锚点的位置
          if (clickPoint > 0 && ((activeEdge._attrs.model.controlPoints || []).length - 1 !== clickPoint)) {
            if (ev.keyCode === 37) {
              this.net.update(activeEdge, {
                ...activeEdge._attrs.model,
                controlPoints: (activeEdge._attrs.model.controlPoints || []).map((pt, index) => {
                  if (index === clickPoint) {
                    this.clickEdgeX = pt.x - (10 / count);
                    this.clickEdgeY = pt.y;
                    return {
                      x: pt.x - (10 / count),
                      y: pt.y,
                    };
                  }
                  return pt;
                })
              })
            } else if (ev.keyCode === 38) {
              this.net.update(activeEdge, {
                ...activeEdge._attrs.model,
                controlPoints: (activeEdge._attrs.model.controlPoints || []).map((pt, index) => {
                  if (index === clickPoint) {
                    this.clickEdgeX = pt.x;
                    this.clickEdgeY = pt.y - (10 / count);
                    return {
                      x: pt.x,
                      y: pt.y - (10 / count),
                    };
                  }
                  return pt;
                })
              })
            } else if (ev.keyCode === 39) {
              this.net.update(activeEdge, {
                ...activeEdge._attrs.model,
                controlPoints: (activeEdge._attrs.model.controlPoints || []).map((pt, index) => {
                  if (index === clickPoint) {
                    this.clickEdgeX = pt.x + (10 / count);
                    this.clickEdgeY = pt.y;
                    return {
                      x: pt.x + (10 / count),
                      y: pt.y,
                    };
                  }
                  return pt;
                })
              })
            } else if (ev.keyCode === 40) {
              this.net.update(activeEdge, {
                ...activeEdge._attrs.model,
                controlPoints: (activeEdge._attrs.model.controlPoints || []).map((pt, index) => {
                  if (index === clickPoint) {
                    this.clickEdgeX = pt.x;
                    this.clickEdgeY = pt.y + (10 / count);
                    return {
                      x: pt.x,
                      y: pt.y + (10 / count),
                    };
                  }
                  return pt;
                })
              })
            }
            const domPosition = this.net.converPoint({x: this.clickEdgeX, y: this.clickEdgeY});
            this.pointerDom.style.display = 'block';
            this.pointerDom.style.top = `${domPosition.y - 3}px` ;
            this.pointerDom.style.left = `${domPosition.x - 3}px`;
          }
        }
      }
      if (ev.shiftKey) {
        if (this.net._attrs.mode === 'edit') {
          // 切换到编辑模式时执行鼠标的松开事件，防止选中框残留
          this.net.events.mouseup.forEach(m => m());
          const { modeChange } = this.props;
          //this.net.changeMode('drag');
          modeChange && modeChange('drag');
        }
      }
    });
    this.net.on('keyup', (ev) => {
      if (ev.keyCode === 16) {
        if (this.net._attrs.mode === 'drag') {
          const { modeChange } = this.props;
          //this.net.changeMode('drag');
          modeChange && modeChange('edit');
        }
      }
    });
    this.net.on('itemadd', (ev) => {
      let item = ev.item;
      if(item.get('type') === 'node'){
        // 处理复制的情况
        const nodes = this.net.getNodes();
        // 新增table的标题
        const title = item._attrs.model.title;
        //const realName = item._attrs.model.realName;
        const titles = nodes.map(node => node._attrs.model.title);
        const tables = this._getAllTable(this.props.dataSource).map(t => t.title);
        const newTitle = this._checkTableName(title, titles);
        if (title !== newTitle) {
          // 将此表进行重命名，并且更新
          // this._updateTableName()
          if (!item._attrs.model.copy) {
            const copyTable = this._getAllTable(this.props.dataSource).filter(t => title === t.title)[0];
            const newTempTitle = this._checkTableName(newTitle.split(':')[0], tables.concat(titles));
            const pointer = this.net.invertPoint({ x: this.domX, y: this.domY });
            this.net.update(item, {
              ...item._attrs.model,
              title: newTempTitle,
              realName: this._getTableNameByNameTemplate({
                ...(copyTable || {}),
                title: newTempTitle,
              }, newTempTitle),
              copy: title.split(':')[0],
              x: pointer.x,
              y: pointer.y,
            });
            this.table.push({
              ...item._attrs.model,
              title: newTempTitle,
            });
            this.net.refresh();
          } else {
            setTimeout(() => {
              this.net.remove(item);
              this.net.refresh();
            }, 1);
            Modal.error({
              title: '复制失败',
              message: '无法从一个克隆表中复制一个新的数据表，请先保存该克隆表！',
              width: 450
            });
          }
        }
      }
    });
    this.net.on('itemremove', (ev) => {
      // 移除item需要更新缓存表

      let item = ev.item;
      if(item.get('type') === 'node'){
        this.table = this.table.filter(table => table.title !== ev.item._attrs.model.title);
      } else if (item.get('type') === 'edge') {
        setTimeout(() => {
          const { value, dataSource } = this.props;
          const data = this.net.save().source;
          const moduleName = value.split('map&')[1].split('/')[0];
          const module = (dataSource.modules || []).filter(mo => mo.name === moduleName)[0];
          this.net.changeData({
            ...data,
            nodes: (data.nodes || []).map((node) => ({
              ...node,
              associations: this._getAssociations(data, module)
            }))
          });
        }, 1);
      }
      // this.graphCanvas = this.net.save().source;
    });
    // 右键菜单
    this.net.on('contextmenu', (ev) => {
      if (this.net._attrs.mode === 'edit') {
        let clickPoint = -1;
        let item = ev.item;
        let contextMenus = [];
        if(item && item.get('type') === 'node' && item._attrs.actived){
          contextMenus = [
            { name: <span><Icon type='delete' style={{color: '#FF0000', marginRight: 5}}/>删除数据表</span>,
              key: 'deleteTable',
            }];
        } else if (item && item.get('type') === 'edge' && item._attrs.actived){
          contextMenus = [
            { name: <span><Icon type='edit' style={{color: '#008000', marginRight: 5}}/>对应关系</span>,
              key: 'relation'},
            { name: <span><Icon type='delete' style={{color: '#FF0000', marginRight: 5}}/>删除连接线</span>,
              key: 'deleteEdge'},
            ];
          // 判断点击的时候是否锚点
          const model = item._attrs.model;
          // 1.计算点击的和当前边的所有锚点的距离
          const controlPoints = model.controlPoints.map((point, index) => {
            const domPointer = this.net.invertPoint({x: ev.domX, y: ev.domY});
            return {
              index,
              distance: (point.x - domPointer.x) * (point.x - domPointer.x)
              + (point.y - domPointer.y) * (point.y - domPointer.y)
            };
          });
          clickPoint = model.controlPoints.findIndex((point, index) => controlPoints[index].distance < 10);
          if (clickPoint > -1) {
            contextMenus.push(
              { name: <span><Icon type='delete' style={{color: '#FF0000', marginRight: 5}}/>删除锚点</span>,
                key: 'deleteAnchor'})
          } else {
            contextMenus.push({ name: <span><Icon type='addfolder' style={{color: '#008000', marginRight: 5}}/>添加锚点</span>,
              key: 'addAnchor'})
          }
        } else if (!item){
          /*contextMenus = [
            { name: <span><Icon type='addfolder' style={{color: '#008000', marginRight: 5}}/>新增数据表</span>,
              key: 'addTable'}];*/
        }
        this.setState({
          item,
          top: ev.domY,
          left: ev.domX,
          contextDisplay: contextMenus.length > 0 ? '' : 'none',
          contextMenus: contextMenus,
          clickPoint
        });
      }
    });
    this.net.source(data.nodes, data.edges);
    this.net.node().color('title', (val) => {
      if (val && val.includes(':')) {
        return '#5D616A'
      }
      return '#353B47';
    });

    this.net.render();
  };
  _tableHasExistAndUpdateName = (graphCanvas, name) => {
    if ((graphCanvas.nodes || []).some(node => node.title === name)) {
      const tempName = name.split(':');
      if (tempName[1]) {
        return this._tableHasExistAndUpdateName(graphCanvas, `${tempName[0]}:${parseInt(tempName[1], 10) + 1}`);
      }
      return this._tableHasExistAndUpdateName(graphCanvas, `${name}:1`);
    }
    return name;
  };
  _onDrop = (e) => {
    e.preventDefault();
    const { value, width } = this.props;
    const moduleName = value.split('map&')[1].split('/')[0];
    const data = e.dataTransfer.getData('Text');
    if (data.startsWith('map&')) {
      Modal.error({title: '移动无效', message: '该内容不是数据表，无法放置在关系图中！', width: 300})
    } else {
      if (data.startsWith('entity&')) {
        // 将拖入的数据表放入画布中
        const paintRect = e.target.getBoundingClientRect();
        // 判断该表在画布中是否已经存在了
        // 1.获取画布中的数据
        this.graphCanvas = this.net.save().source;
        // 2.检查画布中的数据
        let x = e.clientX - paintRect.left;
        let y = e.clientY - paintRect.top;
        const point = this.net.invertPoint({x, y});
        let table = this._tableHasExistAndUpdateName(this.graphCanvas, data.split('&')[2]);
        this._addDataTable(table, point.x , point.y, 'drag',
          data.split('&')[1] !== moduleName && data.split('&')[1]);
      }
      /*if (data.split('&')[1] !== moduleName) {
        Modal.error({title: '移动无效', message: '目前暂不支持跨模块之间的数据表关系配置！', width: 350})
      } else {
        if (data.startsWith('entity&')) {
          // 将拖入的数据表放入画布中
          const paintRect = e.target.getBoundingClientRect();
          // 判断该表在画布中是否已经存在了
          // 1.获取画布中的数据
          this.graphCanvas = this.net.save().source;
          // 2.检查画布中的数据
          let x = e.clientX - paintRect.left;
          let y = e.clientY - paintRect.top;
          const point = this.net.invertPoint({x, y});
          let table = this._tableHasExistAndUpdateName(this.graphCanvas, data.split('&')[2]);
          this._addDataTable(table, point.x , point.y, 'drag');
        }
      }*/
    }
  };

  _onDragOver = (e) => {
    e.preventDefault();
  };
  _saveTable = (table, type) => {
    const { saveProject, project, dataSource, value } = this.props;
    const moduleName = value.split('map&')[1].split('/')[0];
    saveProject(`${project}.pdman.json`, {
      ...dataSource,
      modules: (dataSource.modules || []).map((mo) => {
        if (mo.name === moduleName) {
          return {
            ...mo,
            entities: type === 'new' ? (mo.entities || []).concat(table)
              : (mo.entities || []).map((entity) => {
              if (entity.title === table.title) {
                return table;
              }
              return entity;
            }),
          };
        }
        return mo;
      }),
    });
  };
  _getAllTableData = (dataSource) => {
    const tempTable = this.table.map(entity => entity.title);
    return (dataSource.modules || []).reduce((a, b) => {
      return a.concat((b.entities || []));
    }, []).concat(tempTable);
  };
  _addDataTable = (title, x, y, type, tableModuleName) => {
    const { dataSource, value } = this.props;
    let tableData = null;
    const mapData = {...this.net.save().source};
    const nodes = _object.get(mapData, 'nodes', []);
    const edges = _object.get(mapData, 'edges', []);
    const moduleName = value.split('map&')[1].split('/')[0];
    const module = _object.get(dataSource, 'modules', []).filter(mo => mo.name === moduleName)[0];
    const associations = _object.get(module, 'associations', []);
    if (type === 'new') {
      // 保存table到内存
      this.table.push({
        title: title,
        fields: [],
        headers: [],
        associations,
        realName: title,
      });
      /*// 将数据表保存到文件
      const { project, saveProject, dataSource, value } = this.props;
      const moduleName = value.split('map_')[1].split('-')[0];
      saveProject(`${project}.pdman.json`, {
        ...dataSource,
        modules: (dataSource.modules || []).map(m => {
          if (m.name === moduleName) {
            return {
              ...m,
              entities: (m.entities || []).concat({
                title: title,
                fields: [],
              })
            }
          }
          return m;
        })
      });*/
    } else {
      const tables = this._getAllTableData(dataSource);
      tableData = tables.filter(table => table.title === title.split(':')[0])[0];
    }
    const realName = this._getTableNameByNameTemplate(tableData, title.split(':')[0]);
    nodes.push({
      shape: 'table',
      title: title,
      realName: title.includes(':') ? `${realName}:${title.split(':')[1]}` : realName,
      headers: this._initColumnOrder(tableData),
      fields: ((tableData && tableData.fields) || []).filter(field => !field.relationNoShow),
      associations,
      moduleName: tableModuleName,
      x: x,
      y: y,
    });
    this.net.changeData(nodes, edges);
    this._checkEmpty({nodes, edges});
  };
  _checkUntitledName = (name) => {
    if (!name.split('untitled')[1]) {
      return `${name}1`;
    }
    return `untitled${parseInt(name.split('untitled')[1] || 0, 10) + 1}`;
  };
  _getAllTable = (dataSource, table, moduleName) => {
    const tempTable = (table || this.table).map(entity => entity.title);
    let modules = (dataSource.modules || []);
    if (moduleName) {
      modules = modules.filter(module => module.name === moduleName);
    }
    return modules.reduce((a, b) => {
      return a.concat((b.entities || []).map(entity => entity.title));
    }, []).concat(tempTable);
  };
  _getTableName = (tables = [], name) => {
    if (tables.some(table => table === name)) {
      return this._getTableName(tables, this._checkUntitledName(name));
    }
    return name;
  };
  _contextClick = (e, key) => {
    const { dataSource, width } = this.props;
    const { item, left, top, clickPoint } = this.state;
    if (key === 'deleteTable' || key === 'deleteEdge') {
      /*this.table = this.table.filter(table => table.title !== item._attrs.model.title);
      this.graphCanvas = {
        ...this.graphCanvas,
        nodes: this.graphCanvas.nodes.filter(node => node.title !== item._attrs.model.title),
      };*/
      this.del(item);
    } else if (key === 'addTable'){
      const point = this.net.invertPoint({x: left, y: top});
      this._addDataTable(this._getTableName(this._getAllTable(dataSource), 'untitled'), point.x, point.y, 'new');
    } else if (key === 'addAnchor') {
      // 给连接线增加节点
      const tempControlPoints = [...item._attrs.model.controlPoints || []];
      tempControlPoints.splice(1, 0, { x: left, y: top });
      this.net.update(item, {
        ...item._attrs.model,
        controlPoints: tempControlPoints
      });
      this.net.refresh();
    } else if (key === 'deleteAnchor') {
      this.net.update(item, {
        ...item._attrs.model,
        controlPoints: item._attrs.model.controlPoints.filter((point, index) => index !== clickPoint),
      });
      this.net.refresh();
    } else if (key === 'relation') {
      // 打开弹出框编辑对应关系
      const relation = item._attrs.model.relation || '';
      const from = relation.split(':')[0] || '';
      const to = relation.split(':')[1] || '';
      openModal(<RelationEdit from={from} to={to}/>,
        {
          title: '编辑对应关系',
          modality: true,
          autoFocus: true,
          onOk: (modal, com) => {
            com.save((err, value) => {
              if (!err) {
                modal.close();
                this.net.update(item, {
                  ...item._attrs.model,
                  relation: value,
                });
                this.net.refresh();
              } else {
                Modal.error({title: '编辑失败', message: '编辑失败', width: 100})
              }
            });
          }
        });
    }
  };
  _closeContextMenu = () => {
    this.setState({
      contextDisplay: 'none',
    });
  };
  _zoomTree = (scale) => {
    const { width, height } = this.props;
    const centerNode = this.net.invertPoint({x: width / 2, y: height / 2});
    const p0 = centerNode;
    const p1 = centerNode;
    const matrix = new G6.Matrix.Matrix3();
    const x = p0.x + (p1.x - p0.x) * 1;
    const y = p0.y + (p1.y - p0.y) * 1;
    matrix.translate(-x, -y);
    matrix.scale(scale, scale);
    matrix.translate(width / 2, height / 2);
    this.net.updateMatrix(matrix);
    this.net.refresh();
    this.setState({
      count: this.net.getScale(),
    })
  };
  _keyDown = (e, close) => {
    // 按下M键
    if (e.key === 'm') {
      const { value } = this.props;
      const paint = document.getElementById(`paint-${value}`);
      const navigation = paint && paint.querySelector('.g6-plugins-navigation');
      if (getComputedStyle(navigation).display === 'none' && !close) {
        navigation.style.display = 'block';
      } else {
        navigation.style.display = 'none';
      }
    }
  };
  render() {
    const { empty = false, count = 1 } = this.state;
    const { prefix = 'pdman', value, width } = this.props;
    return (<div
      onKeyDown={this._keyDown}
      className={`${prefix}-relation`}
      onDrop={this._onDrop}
      onDragOver={this._onDragOver}
    >
      <div className={`${prefix}-relation-pointer`} ref={instance => this.pointer = instance}>
        {}
      </div>
      <Context
        menus={this.state.contextMenus}
        left={this.state.left}
        top={this.state.top}
        display={this.state.contextDisplay}
        closeContextMenu={this._closeContextMenu}
        onClick={this._contextClick}
      />
      <div className={`${prefix}-relation-empty`}>
        {empty ? '空关系图，请拖动左侧的数据表于空白处' : ''}
      </div>
      <div
        tabIndex="0"
        className={`${prefix}-relation-paint`}
        id={`paint-${value}`}
      >
        {}
      </div>
      <div
        style={{position: 'fixed', bottom: 10, right: 10, color: '#CCCCCC'}}
      >
        按住shift可拖动关系图，滑动鼠标可放大缩小关系图，按下M可打开或者关闭缩略图
      </div>
      <div
        style={{position: 'fixed', top: 140, right: 20, color: 'green'}}
      >
        放大倍数：{count}X
      </div>
    </div>);
  }
}
