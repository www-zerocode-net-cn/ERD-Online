/* eslint-disable */
import _object from 'lodash/object';
//import G6 from '@antv/g6/dist/index';
import { uuid } from './uuid';

let dom = {};

const addCountTableName = (name, title) => {
  const titleNumber = title.split(':')[1];
  if (name.includes(':')) {
    return name;
  } else if (titleNumber) {
    return `${name}:${titleNumber}`;
  }
  return name;
};

const getTableNameByNameTemplate = (entity, title) => {
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
  return addCountTableName(tempName, title);
};

const  getAllTable = (dataSource, table, moduleName) => {
  const tempTable = (table || this.table).map(entity => entity.title);
  let modules = (dataSource.modules || []);
  if (moduleName) {
    modules = modules.filter(module => module.name === moduleName);
  }
  return modules.reduce((a, b) => {
    return a.concat((b.entities || []).map(entity => entity.title));
  }, []).concat(tempTable);
};

const clearInvalidData = (data, dataSource) => {
  const tables = getAllTable(dataSource, []);
  const tempNodes = (data.nodes || []).filter(node => tables.includes(node.title.split(':')[0]));
  const tempNodesId = tempNodes.map(node => node.id);
  const tempEdges = (data.edges || []).filter(edge =>
    tempNodesId.includes(edge.source) && tempNodesId.includes(edge.target));
  return {
    nodes: tempNodes,
    edges: tempEdges,
  };
};

const initColumnOrder = (dataTable, columnOrder) => {
  // 初始化列的顺序、列在关系图中的显示
  // 返回原引用，否则会影响后续的引用比较
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

const getAssociations = (data, module) => {
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

const getAllTableData = (dataSource) => {
  return (dataSource.modules || []).reduce((a, b) => {
    return a.concat((b.entities || []));
  }, []);
};

const getData = (dataSource, moduleName, columnOrder) => {
  const module = _object.get(dataSource, 'modules', []).filter(mo => mo.name === moduleName)[0];
  const data = clearInvalidData(_object.get(module, 'graphCanvas', {}), dataSource);
  const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
  return {
    ...data,
    nodes: [...(data.nodes || [])].map((node) => {
      const dataTable = getAllTableData(dataSource)
        .filter(entity => entity.title === (node.copy || node.title.split(':')[0]))[0];
      return {
        ...node,
        realName: getTableNameByNameTemplate(dataTable, node.title),
        datatype,
        associations: getAssociations(data, module),
        headers: initColumnOrder(dataTable, columnOrder),
        fields: _object.get(dataTable, 'fields', [])
          .filter(field => !field.relationNoShow),
        edges: [...(data.edges || [])],
      };
    }),
  };
};

const renderRelation = (data, id) => {
  const Util = G6.Util;
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
                y1: box.maxY,
                x2: box.maxX,
                y2: box.maxY,
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
  const net = new G6.Net({
    id: id,      // 容器ID
    height: 2000,
    width: 2000,
    fitView: 'autoZoom',
    grid: null
  });
  net.source(data.nodes, data.edges);
  net.node().color('title', (val) => {
    if (val && val.includes(':')) {
      return '#5D616A';
    }
    return '#353B47';
  });
  net.render();
  return net;
};

const createNotRelationDom = () => {
  const dom = document.createElement('div');
  dom.innerText = '未绘制关系图';
  dom.style.width = '200px';
  dom.style.height = '200px';
  dom.style.textAlign = 'center';
  return dom;
};

export const saveImage = (dataSource, columnOrder, writeFile, callBack, errorCallback) => {
  // 循环渲染每个模块的关系图
  const modules = _object.get(dataSource, 'modules', []);
  const images = {};
  Promise.all(modules.map((module) => {
    return new Promise((res, rej) => {
      // 创建容器
      const id = uuid();
      const tempDom = document.createElement('div');
      tempDom.setAttribute('id', id);
      tempDom.style.width = '2000px';
      tempDom.style.height = '2000px';
      document.body.appendChild(tempDom);
      dom[id] = tempDom;
      const data = getData(dataSource, module.name, columnOrder);
      let graphContainer = null;
      if (data.nodes && data.nodes.length === 0) {
        graphContainer = createNotRelationDom();
        dom[id].appendChild(graphContainer);
      } else {
        // 渲染关系图
        const net = renderRelation(data, id);
        graphContainer = net.get('graphContainer');
      }
      // 将关系图转成canvas
      setTimeout(() => {
        html2canvas(graphContainer).then(canvas => {
          // 生成base64的图片
          images[module.name] = canvas.toDataURL('image/png');
          // 删除所有的DOM
          dom[id] && dom[id].parentNode.removeChild(dom[id]);
          res();
        }).catch(err => {
          rej(err);
        });
      })
    })
  })).then(() => {
    callBack && callBack(images);
  }).catch(err => {
    errorCallback && errorCallback(err);
  });
};
