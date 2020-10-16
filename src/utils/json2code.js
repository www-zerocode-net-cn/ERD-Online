/* eslint-disable */
import _object from 'lodash/object';
import { Message } from '../components';
import doT from 'dot';

const getFieldType = (datatype, type, code) => {
  const data = (datatype || []).filter(dt => dt.code === type)[0];
  if (data) {
    return _object.get(data, `apply.${code}.type`,'');
  }
  return type;
};

const getTemplateString = (template, templateData) => {
  const camel = (str, firstUpper) => {
    let ret = str.toLowerCase();
    ret = ret.replace( /_([\w+])/g, function( all, letter ) {
      return letter.toUpperCase();
    });
    if(firstUpper){
      ret = ret.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
        return $1.toUpperCase() + $2;
      });
    }
    return ret;
  };
  const underline = (str, upper) => {
    const ret = str.replace(/([A-Z])/g,"_$1");
    if(upper){
      return ret.toUpperCase();
    }else{
      return ret.toLowerCase();
    }
  };
  const upperCase = (str) => {
    return str.toLocaleUpperCase();
  };
  const lowerCase = (str) => {
    return str.toLocaleLowerCase();
  };
  const join = (...args) => {
    if(args.length<=2)return args[0];
    const datas = [];
    const delimter = args[args.length-1];
    for(let i=0;i<args.length-1;i++){
      if(/^\s*$/.test(args[i]))continue;
      datas.push(args[i]);
    }
    return datas.join(delimter);
  };
  const objectkit = {
    isJSON: function(obj) {
      var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
      return isjson;
    },
    deepClone: function(obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    equals: function(v1, v2) {
      if (typeof(v1) === "object" && objectkit.isJSON(v1) && typeof(v2) === "object" && objectkit.isJSON(v2)) {
        return JSON.stringify(v1) == JSON.stringify(v2);
      } else {
        return v1 == v2;
      }

    }
  };
  const getIndex = (array, arg, n) => {
    var i = isNaN(n) || n < 0 ? 0 : n;
    for (; i < array.length; i++) {
      if (array[i] == arg) {
        return i;
      } else if (typeof(array[i]) === "object" && objectkit.equals(array[i], arg)) {
        return i;
      }
    }
    return -1;
  };
  const contains = (array, obj) => {
    return getIndex(array, obj) >= 0;
  };
  const uniquelize = (array) => {
    var copy = clone(array);
    const temp = [];
    for (var i = 0; i < copy.length; i++) {
      if (!contains(temp, copy[i])) {
        temp.push(copy[i]);
      }
    }
    return temp;
  };
  const clone = (array) => {
    var cloneList = Array();
    for (var i = 0, a = 0; i < array.length; i++) {
      cloneList.push(array[i]);
    }
    return cloneList;
  };
  const each = (array, fn) => {
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < array.length; i++) {
      var res = fn.apply(array, [array[i], i].concat(args));
      if (res != null) a.push(res);
    }
    return a;
  };
  const intersect = (array1, array2) => {
    // 交集
    const copy = clone(array1);
    const r = each(uniquelize(copy), function(o) { return contains(array2, o) ? o : null });
    return [].concat(r);
  };
  const union = (array1, array2) => {
    var copy = clone(array1);
    var r = uniquelize(copy.concat(array2));
    return [].concat(r);
  };
  const minus = (array1, array2) => {
    var copy = clone(array1);
    var r = each(uniquelize(copy), function(o) { return contains(array2, o) ? null : o });
    return [].concat(r);
  };
  const tplText = template.replace(/(^\s*)|(\s*$)/g, "");
  const conf = {
    evaluate:    /\{\{([\s\S]+?)\}\}/g,
    interpolate: /\{\{=([\s\S]+?)\}\}/g,
    encode:      /\{\{!([\s\S]+?)\}\}/g,
    use:         /\{\{#([\s\S]+?)\}\}/g,
    define:      /\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,
    conditional: /\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,
    iterate:     /\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,
    varname: 'it',
    strip: false,
    append: true,
    doNotSkipEncoded:false,
    selfcontained: false
  };
  let resultText = doT.template(tplText, conf)({
    ...templateData,
    func: {
      camel: camel,
      underline: underline,
      upperCase: upperCase,
      lowerCase: lowerCase,
      join: join,
      intersect: intersect,
      union: union,
      minus: minus,
    }
  });
  resultText = resultText.replace(/\n(\n)*( )*(\n)*\n/g,"\n");  //删除空行
  resultText = resultText.replace(/\$blankline/g,'');              //单独处理需要空行的情况
  return resultText;
};

const generateIncreaseSql = (dataSource, module, dataTable, code, templateShow) => {
  const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
  const database = _object.get(dataSource, 'dataTypeDomains.database', [])
    .filter(db => db.code === code)[0];
  const template = templateShow ? ((database && database[templateShow]) || '') : ((database && database.template) || '');
  const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
  // 构造新的数据表传递给模板
  const tempDataTable = {
    ...dataTable,
    fields: (dataTable.fields || []).map(field => {
      return {
        ...field,
        type: getFieldType(datatype, field.type, code),
      }
    })
  };
  if (templateShow === 'createIndexTemplate') {
    return (dataTable.indexs || []).map(i => {
      return `${getTemplateString(template, {
        module: { name: module },
        entity: tempDataTable,
        index: i,
        separator
      })}`;
    }).join('\n');
  } else {
    return getTemplateString(template, {
      entity: tempDataTable,
      module: { name: module },
      separator
    });
  }
};

const getAllTable = (dataSource, name) => {
  return (dataSource.modules || []).reduce((a, b) => {
    return a.concat((b.entities || []).map(e => ({...e, [name]: b[name]})));
  }, []);
};

const generateUpdateSql = (dataSource, changesData = [], code, oldDataSource) => {
  const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
  const database = _object.get(dataSource, 'dataTypeDomains.database', [])
    .filter(db => db.code === code)[0];
  // 合并字段其他变化，只留一个
  const fieldsChanges = [];
  const changes = changesData.filter(c => {
    if (c.type === 'field' && c.opt === 'update') {
      const name = c.name.split('.');
      const fieldName = name[0] + name[1];
      if (fieldsChanges.includes(fieldName)) {
        return false;
      } else {
        fieldsChanges.push(fieldName);
        return true;
      }
    }
    return true;
  });
  let templateResult = '';
  const getTemplate = (templateShow) => {
    return `${(database && database[templateShow]) || ''}`;
  };
  const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
  // 构造新的数据表传递给模板
  const tempEntities = getAllTable(dataSource, 'name').map((entity) => {
    return {
      ...entity,
      fields: (entity.fields || []).map(field => {
        return {
          ...field,
          type: getFieldType(datatype, field.type, code),
        }
      })
    }
  });

  // 上个版本的数据表信息，用于重建数据表
  const oldEntities = getAllTable(oldDataSource, 'name').map((entity) => {
    return {
      ...entity,
      fields: (entity.fields || []).map(field => {
        return {
          ...field,
          type: getFieldType(datatype, field.type, code),
        }
      })
    }
  });

  // 将不同类型的模板组装到一起生成一个sql文件
  // 1.生成属性的sql
  templateResult += changes
    .filter(c => c.type === 'field')
    .map((c) => {
      if (c.opt === 'update') {
        const change = c.name.split('.');
        const dataTable = tempEntities.filter(t => t.title === change[0])[0] || {};
        const field = (dataTable.fields || []).filter(f => f.name === change[1])[0] || {};
        const changeData = (c.changeData || '').split('=>');
        return getTemplateString(getTemplate('updateFieldTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          field: {
            ...field,
            updateName: change[2],
            update: changeData[1],
          },
          separator
        });
      } else if (c.opt === 'add') {
        const change = c.name.split('.');
        const dataTable = tempEntities.filter(t => t.title === change[0])[0] || {};
        const field = (dataTable.fields || []).filter(f => f.name === change[1])[0] || {};
        // 从当前的属性中获取该位置之前的属性位置
        let addAfter = undefined;
        const position = (dataTable.fields || []).findIndex(f => field.name === f.name);
        if (position > 0) {
          addAfter = (dataTable.fields || [])[position - 1] && (dataTable.fields || [])[position - 1].name || undefined;
        }
        return getTemplateString(getTemplate('createFieldTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          field: {
            ...field,
            addAfter,
          },
          separator
        });
      } else {
        const change = c.name.split('.');
        const dataTable = tempEntities.filter(t => t.title === change[0])[0] || {};
        return getTemplateString(getTemplate('deleteFieldTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          field: {
            name: change[1],
          },
          separator
        });
      }
    }).join('\n');

  templateResult += changes
    .filter(c => c.type === 'index')
    .map((c) => {
      const change = c.name.split('.');
      const dataTable = tempEntities.filter(t => t.title === change[0])[0] || {};
      const indexName = change[1];
      const indexData = _object.get(dataTable, 'indexs', []);
      const index = indexData.filter(i => i.name === indexName)[0] || { name: indexName };
      if (c.opt === 'add') {
        // 根据数据表中的内容获取索引
        return getTemplateString(getTemplate('createIndexTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          index,
          separator
        });
      } else if (c.opt === 'update') {
        // 1.先删除再重建
        let deleteString = getTemplateString(getTemplate('deleteIndexTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          index,
          separator
        });
        let createString = getTemplateString(getTemplate('createTableTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          index,
          separator
        });
        return `${deleteString}${separator}\n${createString}`;
      }
      return getTemplateString(getTemplate('deleteIndexTemplate'), {
        module: { name: dataTable.name },
        entity: dataTable,
        index,
        separator
      });
    })
    .join('\n');

  // 3.生成实体的sql
  templateResult += changes
    .filter(c => c.type === 'entity')
    .map((c) => {
      if (c.opt === 'add') {
        const change = c.name;
        const dataTable = tempEntities.filter(t => t.title === change)[0] || {};
        return getTemplateString(getTemplate('createTableTemplate'), {
          module: { name: dataTable.name },
          entity: dataTable,
          separator
        });
      } else if (c.opt === 'update') {
        // 重建数据表
        const change = c.name;
        const dataTable = tempEntities.filter(t => t.title === change)[0] || {};
        const oldDataTable = oldEntities.filter(t => t.title === change)[0] || {};
        return getTemplateString(getTemplate('rebuildTableTemplate'), {
          module: { name: dataTable.name },
          oldEntity: oldDataTable,
          newEntity: dataTable,
          separator
        });
      } else {
        const change = c.name;
        return getTemplateString(getTemplate('deleteTableTemplate'), {
          entity: {
            title: change
          },
          separator
        });
      }
    }).join('\n');
  return templateResult.endsWith(separator) ? templateResult : templateResult + separator;
};

const getCodeByRebuildTableTemplate = (dataSource, changes, code, oldDataSource) => {
  let sqlString = '';
  try {
    const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    const database = _object.get(dataSource, 'dataTypeDomains.database', [])
      .filter(db => db.code === code)[0];
    const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
    const getTemplate = (templateShow) => {
      return `${(database && database[templateShow]) || ''}`;
    };
    // 构造新的数据表传递给模板
    const tempEntities = getAllTable(dataSource, 'name').map((entity) => {
      return {
        ...entity,
        fields: (entity.fields || []).map(field => {
          return {
            ...field,
            type: getFieldType(datatype, field.type, code),
          }
        })
      }
    });
    // 上个版本的数据表信息，用于重建数据表
    const oldEntities = getAllTable(oldDataSource, 'name').map((entity) => {
      return {
        ...entity,
        fields: (entity.fields || []).map(field => {
          return {
            ...field,
            type: getFieldType(datatype, field.type, code),
          }
        })
      }
    });
    const entities = changes
      .filter(c => c.type === 'field')
      .map(c => c.name.split('.')[0]);
    [...new Set(entities)].forEach(e => {
      const dataTable = tempEntities.filter(t => t.title === e)[0] || {};
      const oldDataTable = tempEntities.filter(t => t.title === e)[0] || {};
      sqlString += getTemplateString(getTemplate('rebuildTableTemplate'), {
        module: { name: dataTable.name },
        oldEntity: oldDataTable,
        newEntity: dataTable,
        separator
      })
    });
  } catch (e) {
    Message.error({title: '数据库模板出错，请参考Dot.js配置模板信息'});
    sqlString = JSON.stringify(e.message);
  }
  return sqlString;
};

export const getCodeByChanges = (dataSource, changes, code, oldDataSource = {}) => {
  let sqlString = '';
  try {
    sqlString = generateUpdateSql(dataSource, changes, code, oldDataSource)
  } catch (e) {
    Message.error({title: '数据库模板出错，请参考Dot.js配置模板信息'});
    sqlString = JSON.stringify(e.message);
  }
  return sqlString;
};

export const getCodeByDataTable = (dataSource, module, dataTable, code, templateShow, changes = [], oldDataSource = {}) => {
  let sqlString = '';
  try {
    // 除了数据表的增删，其余的模板都是用变化模板
    if (templateShow === 'createTableTemplate' || templateShow === 'deleteTableTemplate'
      || templateShow === 'createIndexTemplate') {
      sqlString = generateIncreaseSql(dataSource, module, dataTable, code, templateShow);
    } else if(templateShow === 'rebuildTableTemplate') {
      sqlString = getCodeByRebuildTableTemplate(dataSource, changes, code, oldDataSource);
    } else {
      sqlString = getCodeByChanges(dataSource, changes, code, oldDataSource);
    }
  } catch (e) {
    Message.error({title: '数据库模板出错，请参考Dot.js配置模板信息'});
    sqlString = JSON.stringify(e.message);
  }
  return sqlString;
};

export const getDemoTemplateData = (templateShow) => {
  let data = '';
  const demoTable = {
    "module": {
      "name": "AUTH-用户安全",
    },
    "entity": {
      "title": "AUTH_USER",
      "fields": [
        {
          "name": "ID",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "用户ID",
          "pk": true,
          "notNull": true,
          "autoIncrement": true,
          "defaultValue": "1",
        },
        {
          "name": "CODE",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "用户代码",
          "pk": false,
          "notNull": true,
          "autoIncrement": false,
          "defaultValue": "1",
        },
        {
          "name": "NAME",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "用户名"
        },
        {
          "name": "PASSWORD",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "密码"
        },
        {
          "name": "SALT",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "密码盐值"
        },
        {
          "name": "AVATAR",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "头像"
        },
        {
          "name": "ORG_ID",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "机构"
        },
        {
          "name": "EMAIL",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "邮件"
        },
        {
          "name": "PHONE",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "手机号"
        },
        {
          "name": "STATUS",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "状态"
        },
        {
          "name": "REVISION",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "乐观锁",
          "relationNoShow": false
        },
        {
          "name": "CREATED_BY",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "创建人",
          "relationNoShow": false
        },
        {
          "name": "CREATED_TIME",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "创建时间",
          "relationNoShow": false
        },
        {
          "name": "UPDATED_BY",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "更新人",
          "relationNoShow": false
        },
        {
          "name": "UPDATED_TIME",
          "type": "VARCHAR(32)",
          "remark": "",
          "chnname": "更新时间",
          "relationNoShow": false
        }
      ],
      "chnname": "用户信息",
      "indexs": [
        {
          "name": "AUTH_USER_INDEX1",
          "isUnique": true,
          "fields": [
            "ID",
            "CODE"
          ]
        },
        {
          "name": "AUTH_USER_INDEX2",
          "isUnique": false,
          "fields": [
            "NAME",
            "PASSWORD"
          ]
        }
      ]
    }
  };
  const demoField = {
    "name": "ID",
    "type": "VARCHAR(32)",
    "remark": "",
    "chnname": "用户ID",
    "pk": true,
    "notNull": true,
    "autoIncrement": true,
    "defaultValue": "1",
  };
  const demoIndex = {
    "name": "AUTH_USER_INDEX1",
    "isUnique": true,
    "fields": [
      "ID",
      "CODE"
    ]
  };
  switch (templateShow) {
    case 'createTableTemplate':
      data = JSON.stringify({...demoTable, separator: ';'}, null, 2);
      break;
    case 'deleteTableTemplate':
      data = JSON.stringify({...demoTable, separator: ';'}, null, 2);
      break;
    case 'rebuildTableTemplate':
      data = JSON.stringify({
        oldEntity: _object.get(demoTable, 'entity'),
        newEntity: _object.get(demoTable, 'entity'),
        ..._object.omit(demoTable, 'entity'),
        separator: ';'
      }, null, 2);
      break;
    case 'createFieldTemplate':
      data = JSON.stringify({
        field: {
          ...demoField,
          addAfter: 'DEMO_NAME'
        },
        ...demoTable,
        separator: ';'
      }, null, 2);
      break;
    case 'updateFieldTemplate':
      data = JSON.stringify({
        field: {
          ...demoField,
          updateName: 'chnname',
          update: '用户编号',
        },
        ...demoTable,
        separator: ';'
      }, null, 2);
      break;
    case 'deleteFieldTemplate':
      data = JSON.stringify({
        field: {
          name: demoField.name,
        },
        ...demoTable,
        separator: ';'
      }, null, 2);
      break;
    case 'deleteIndexTemplate':
      data = JSON.stringify({
        index: {
          name: demoIndex.name,
        },
        ...demoTable,
        separator: ';'
      }, null, 2);
      break;
    case 'createIndexTemplate':
      data = JSON.stringify({
        index: demoIndex,
        ...demoTable,
        separator: ';'
      }, null, 2);
      break;
    case 'updateTableComment':
      data = JSON.stringify({
        ...demoTable,
        separator: ';'
      }, null, 2);
      break;
    default:break;
  }
  return data;
};

export const getDataByTemplate = (data, template) => {
  let sqlString = '';
  try {
    sqlString = getTemplateString(template, data);
  } catch (e) {
    Message.error({title: '数据库模板出错，请参考Dot.js配置模板信息'});
    sqlString = JSON.stringify(e.message);
  }
  return sqlString;
};

export const getAllDataSQL = (dataSource, code) => {
  // 获取全量脚本（删表，建表，建索引）
  const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
  const database = _object.get(dataSource, 'dataTypeDomains.database', [])
    .filter(db => db.code === code)[0];
  const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
  const getTemplate = (templateShow) => {
    return `${(database && database[templateShow]) || ''}`;
  };
  let sqlString = '';
  // 1.获取所有的表
  const tempEntities = getAllTable(dataSource, 'name').map((entity) => {
    return {
      ...entity,
      fields: (entity.fields || []).map(field => {
        return {
          ...field,
          type: getFieldType(datatype, field.type, code),
        }
      })
    }
  });
  sqlString += tempEntities.map(e => {
    // 1.1.删除表
    // 1.2.新建表
    // 1.3.新建索引

    // 循环创建该表下所有的索引
    let indexData = (e.indexs || []).map(i => {
      return `${getTemplateString(getTemplate('createIndexTemplate'), {
        module: { name: e.name },
        entity: e,
        index: i,
        separator
      })}`;
    }).join('\n');
    return `${getTemplateString(getTemplate('deleteTableTemplate'), {
      module: { name: e.name },
      entity: e,
      separator
    })}\n${getTemplateString(getTemplate('createTableTemplate'), {
      module: { name: e.name },
      entity: e,
      separator
    })}${indexData}`
  }).join('\n');
  return sqlString.endsWith(separator) ? sqlString : sqlString + separator;
};

export const getAllDataSQLByFilter = (dataSource, code, filter = []) => {
  // 获取全量脚本（删表，建表，建索引，表注释）
  const datatype = _object.get(dataSource, 'dataTypeDomains.datatype', []);
  const database = _object.get(dataSource, 'dataTypeDomains.database', [])
    .filter(db => db.code === code)[0];
  const getTemplate = (templateShow) => {
    return `${(database && database[templateShow]) || ''}`;
  };
  const separator = _object.get(dataSource, 'profile.sqlConfig', ';');
  let sqlString = '';
  // 1.获取所有的表
  const tempEntities = getAllTable(dataSource, 'name').map((entity) => {
    return {
      ...entity,
      fields: (entity.fields || []).map(field => {
        return {
          ...field,
          type: getFieldType(datatype, field.type, code),
        }
      })
    }
  });
  sqlString += tempEntities.map(e => {
    // 1.1.删除表
    // 1.2.新建表
    // 1.3.新建索引
    // 表注释

    // 循环创建该表下所有的索引
    let tempData = '';
    let allData = {};
    allData.createIndex = (e.indexs || []).map(i => {
      return `${getTemplateString(getTemplate('createIndexTemplate'), {
        module: { name: e.name },
        entity: e,
        index: i,
        separator
      })}`;
    }).join('\n');
    allData.deleteTable = `${getTemplateString(getTemplate('deleteTableTemplate'), {
      module: {name: e.name},
      entity: e,
      separator
    })}`;
    allData.createTable = `${getTemplateString(getTemplate('createTableTemplate'), {
      module: { name: e.name },
      entity: e,
      separator
    })}`;
    allData.updateComment = `${getTemplateString(getTemplate('updateTableComment'), {
      module: {name: e.name},
      entity: e,
      separator
    })}`;
    filter.forEach(f => {
      tempData += allData[f] ? `${allData[f]}\n` : '';
    });
    return tempData;
  }).join('');
  return sqlString;
};
