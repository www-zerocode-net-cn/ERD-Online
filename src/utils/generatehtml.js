/* eslint-disable */
import _object from 'lodash/object';

const moduleList = '模块清单';
const relation = '关联关系';
const tableList = '表清单';
const tableColumnList = '表列清单';

const name = '名称';
const code = '代码';
const dataType = '数据类型';
const main = '主键';
const remark = '备注';

const getFieldType = (datatype, type, code) => {
  const data = (datatype || []).filter(dt => dt.code === type)[0];
  if (data) {
    return _object.get(data, `apply.${code}.type`,'');
  }
  return type;
};

const generateHeader = (dataSource) => {
  let moduleString = `<ul>\n`;
  const modules = _object.get(dataSource, 'modules', []);
  modules.forEach((module, index) => {
    const entities = module.entities || [];
    moduleString += `<li class="first-li"><a class="module" id="module-${module.name}-from" href="#module-${module.name}-to">${index + 1} ${module.chnname || module.name}</a>\n`;
    moduleString += `<ul><li class="second-li"><a class="module-list" id="module-${module.name}-relation-from" href="#module-${module.name}-relation-to">1 ${relation}</a></li>\n`;
    moduleString += `<li class="second-li"><a class="module-list" id="module-${module.name}-tableList-from" href="#module-${module.name}-tableList-to">2 ${tableList}</a></li>\n`;
    moduleString += `<li class="second-li"><a class="module-list" id="module-${module.name}-tableColumnList-from" href="#module-${module.name}-tableColumnList-to">3 ${tableColumnList}</a>\n`;
    moduleString += `<ul>`;
    entities.forEach((entity, entityIndex) => {
      moduleString += `<li class="third-li"><a id="module-${module.name}-tableColumnList-${entity.title}-from" href="#module-${module.name}-tableColumnList-${entity.title}-to">3.${entityIndex + 1} ${entity.title}【${entity.chnname || ''}】</a></li>\n`
    });
    moduleString += `</ul></li></ul></li>`;
  });
  return `${moduleString}</ul>\n`;
};

const generateTableListTable = (dataSource, moduleName) => {
  /*
  |  名称 | 代码  |
  | ------------ | ------------ |
  | 用户信息  | userManage  |
   */
  let tableString = `<table border="1" cellspacing="0">\n`;
  tableString += `<tr class="first-tr"><td>${name}</td><td>${code}</td><td>${remark}</td></tr>\n`;
  const modules = _object.get(dataSource, 'modules', []);
  modules.forEach((module) => {
    if (module.name === moduleName) {
      const entities = module.entities || [];
      entities.forEach((entity) => {
        tableString += `<tr><td>${entity.chnname || ''}</td><td>${entity.title}</td><td>${entity.remark || ''}</td></tr>\n`;
      })
    }
  });
  return `${tableString}</table>`;
};

const generateTableColumnListTable = (dataSource, moduleName, tableName) => {
  /*
  |  名称 | 代码  |
  | ------------ | ------------ |
  | 用户信息  | userManage  |
   */
  const datatypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
  const databases = _object.get(dataSource, 'dataTypeDomains.database', []).filter(database => database.fileShow);
  const databaseColumn = databases.length !== 0 && `(${databases.map(data => data.code).join('/')})` || '';
  let tableString = `<table border="1" cellspacing="0">\n`;
  tableString += `<tr class="first-tr"><td>${code}</td><td>${name}</td><td>${dataType}${databaseColumn}</td><td>${main}</td><td>${remark}</td></tr>\n`;
  const modules = _object.get(dataSource, 'modules', []);
  modules.forEach((module) => {
    if (module.name === moduleName) {
      const entities = module.entities || [];
      entities.forEach((entity) => {
        if (entity.title === tableName) {
          // 循环实体的属性
          (entity.fields || []).forEach((field) => {
            // 获取每一个属性对应的每一个数据的数据类型
            const fieldTypes = [];
            databases.forEach(database => {
              fieldTypes.push(getFieldType(datatypes, field.type, database.code))
            });
            tableString += `<tr><td>${field.name}</td><td>${field.chnname || ''}</td><td>${fieldTypes.length !== 0 && fieldTypes.join('/') || ''}</td><td>${field.pk && '√' || ''}</td><td>${field.remark || ''}</td></tr>\n`;
          });
        }
      })
    }
  });
  return `${tableString}</table>`;
};

const generateRelation = (moduleName, images, projectName) => {
  /*
  ![Alt text](/path/to/img.jpg "Optional title")
   */
  if (images[moduleName]) {
    return `<img style="width: 98%;margin-top: 10px" src="${images[moduleName]}" title="${moduleName}-关系图"/>`;
  }
  return `<span>该模块未配置关系图</span>`;
};

const generateModuleBody = (dataSource, images = {}, projectName) => {
  /*
  ---
### 1. 模块清单
#### 1.1. 测试模块
 - #### 1.1.1 关联关系
 - #### 1.1.2 表清单
 ---
|  名称 | 代码  |
| ------------ | ------------ |
| 用户信息  | userManage  |
---

 - #### 1.1.3 列清单

 ---
 - ##### 用户信息表1

 ---
 - ##### 用户信息表2

 ---
 - ##### 用户信息表3

 ---

   */
  let modulesString = `<ul>\n\n`;
  const modules = _object.get(dataSource, 'modules', []);
  // 循环所有的模块
  // 生成关系图
  // 生成该模块的表清单
  modules.forEach((module, index) => {
    modulesString += `<li class="first-li"><a class="module" id="module-${module.name}-to" href="#module-${module.name}-from">${index + 1} ${module.chnname || module.name}</a><ul>\n`;
    modulesString += `<li class="second-li"><a class="module-list" class="block" id="module-${module.name}-relation-to" href="#module-${module.name}-relation-from">${index + 1}.1 ${relation}</a>\n`;
    modulesString += `${generateRelation(module.name, images, projectName)}\n`;
    modulesString += `</li><hr>\n`;
    // 表清单
    modulesString += `<li><a class="module-list" id="module-${module.name}-tableList-to" href="module-${module.name}-tableList-from">${index + 1}.2  ${tableList}</a>\n\n`;

    modulesString += `\n\n`;
    modulesString += `${generateTableListTable(dataSource, module.name)}\n`;
    modulesString += `</li><hr>\n\n`;
    // 列清单
    // 循环所有的表
    modulesString += `<li><a class="module-list" id="module-${module.name}-tableColumnList-to" href="module-${module.name}-tableColumnList-from">${index + 1}.3 ${tableColumnList}</a>\n\n`;
    const entities = module.entities || [];
    modulesString += `<ul style="padding: 0">`;
    entities.forEach((entity, entityIndex) => {
      //modulesString += `<span id="module-${module.name}-tableColumnList-${entity.title}">\n`;
      modulesString += ` <li><a class="block" id="module-${module.name}-tableColumnList-${entity.title}-to" href="module-${module.name}-tableColumnList-${entity.title}-from">${index + 1}.3.${entityIndex + 1} ${entity.title}【${entity.chnname || ''}】</a>\n\n`;
      //modulesString += `</span>\n\n`;
      modulesString += `${generateTableColumnListTable(dataSource, module.name, entity.title)}\n`;
      modulesString += `</li>\n\n`;
    });
    modulesString += '</ul></li></ul><hr></li>'
  });
  // 生成该模块的表列清单
  return `${modulesString}</ul>`;
};

export const generateHtml = (dataSource, images, projectName, callBack) => {
  console.log('正在生成html');
  // 初始化去除body的其他内容
  const defaultData = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${projectName}</title>
    <style>
        .index {
            font-weight: bold;
            font-size: 25px;
        }
        .title {
            font-weight: bold;
            font-size: 25px;
        }
        li {
            list-style: none;
            padding: 5px;
        }
        .first-li {
            font-weight: bold;
            font-size: 20px;
        }
        .second-li {
            font-weight: bold;
        }
        .third-li {
            font-weight: normal;
        }
        .block {
            display: block;
        }
        table {
            width: 100%;
            margin-top: 10px;
            border-color: #E8E8E8;
        }
        .first-tr {
            text-align: center;
        }
        tr:hover {
            background: #ECF9FF;
        }
        td {
            font-weight: normal;
            padding: 5px;
            white-space: nowrap;
        }
        a {
            color: #000000;
            background-color: transparent;
            text-decoration: none;
            outline: none;
            cursor: pointer;
        }
        .module {
            color: green;
        }
        .module-list {
            color: #1890ff;
        }
    </style>
</head>
<body>`;
  const index = '<center class="index">目录</center>\n';
  const header = generateHeader(dataSource);
  const body = generateModuleBody(dataSource, images, projectName);
  const endTag = "</body>\n" +
    "</html>";
  callBack && callBack(`${defaultData}${index}<hr>${header}<hr>${body}${endTag}`);
};
