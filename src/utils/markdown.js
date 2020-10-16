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

const escapingChar = (str) => {
// \   反斜线
//     `   反引号
// *   星号
// _   下划线
// {}  大括号
// []  中括号
// ()  小括号
// #   井号
// +   加号
// -   减号（连字符）
// .   句点
// !   感叹号
// 针对某些markdown编辑器无法正确显示特殊字符的情况，需要给特殊字符添加转义字符
  return str.replace(/[`*_{}[\]()#+-.!]/g, (a) => {
    return `\\${a}`;
  });
};

const generateHeader = (dataSource) => {
  /*
  - ### 1.模块清单
	- #### [1.1. 测试模块](#moduleTset "测试模块")
		- ##### 1.1.1. 关联关系
		- ##### 1.1.2. 表清单
		- ##### 1.1.3. 表列清单
			- ###### 1.1.3.1. 用户信息表1
			- ###### 1.1.3.1. 用户信息表2
			- ###### 1.1.3.1. 用户信息表3
   */
  let moduleString = ` - ### 1. ${moduleList}\n`;
  const modules = _object.get(dataSource, 'modules', []);
  modules.forEach((module, index) => {
    const entities = module.entities || [];
    moduleString += `- [<h4 id="module-${module.name}-from">1.${index + 1}. ${escapingChar(module.chnname || module.name)}</h4>](#module-${module.name} "${module.name}")\n`;
    moduleString += `\t- [<h5 id="module-${module.name}-relation}-from">1.${index + 1}.1. ${relation}</h5>](#module-${module.name}-relation "${relation}")\n`;
    moduleString += `\t- [<h5 id="module-${module.name}-tableList-from">1.${index + 1}.2. ${tableList}</h5>](#module-${module.name}-tableList "${tableList}")\n`;
    moduleString += `\t- [<h5 id="module-${module.name}-tableColumnList-from">1.${index + 1}.3. ${tableColumnList}</h5>](#module-${module.name}-tableColumnList "${tableColumnList}")\n`;
    entities.forEach((entity, entityIndex) => {
      moduleString += `\t\t- [<h6 id="module-${module.name}-tableColumnList-${entity.title}-from">1.${index + 1}.3.${entityIndex + 1} ${escapingChar(entity.title)}【${entity.chnname || ''}】</h6>](#module-${module.name}-tableColumnList-${entity.title} "${entity.title}")\n`
    })
  });
  return moduleString;
};

const generateTableListTable = (dataSource, moduleName) => {
  /*
  |  名称 | 代码  |
  | ------------ | ------------ |
  | 用户信息  | userManage  |
   */
  let tableString = `| ${name} | ${code} | ${remark} |\n`;
  tableString += `| ------------ | ------------ | ------------ |\n`;
  const modules = _object.get(dataSource, 'modules', []);
  modules.forEach((module) => {
    if (module.name === moduleName) {
      const entities = module.entities || [];
      entities.forEach((entity) => {
        tableString += `| ${entity.chnname || ''} | ${escapingChar(entity.title)} | ${entity.remark || ''} |\n`;
      })
    }
  });
  return tableString;
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
  let tableString = `| ${code} | ${name} | ${dataType}${databaseColumn} | ${main} | ${remark} |\n`;
  tableString += `| ------------ | ------------ | ------------ | ------------ | ------------ |\n`;
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
            tableString += `| ${escapingChar(field.name)} | ${field.chnname || ''} | ${fieldTypes.length !== 0 && fieldTypes.join('/') || ''} | ${field.pk && '√' || ''} | ${field.remark || ''} |\n`;
          });
        }
      })
    }
  });
  return tableString;
};

const generateRelation = (moduleName, images, projectName) => {
  /*
  ![Alt text](/path/to/img.jpg "Optional title")
   */
  return `\n![${moduleName}-关系图](./${projectName}_files/${images[moduleName]})\n`;
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
  let modulesString = `  ---\n\n`;
  modulesString += `### 1. ${moduleList}\n`;
  const modules = _object.get(dataSource, 'modules', []);
  // 循环所有的模块
  // 生成关系图
  // 生成该模块的表清单
  modules.forEach((module, index) => {
    //modulesString += `<span id="module-${module.name}">\n`;
    modulesString += ` - [<h4 id="module-${module.name}">1.${index + 1}. ${module.chnname || module.name}</h4>](#module-${module.name}-from)\n`;
    //modulesString += `</span>\n`;
    // 关系图
    //modulesString += `<span id="module-${module.name}-relation">\n`;
    modulesString += ` - [<h5 id="module-${module.name}-relation">1.${index + 1}.1 ${relation}</h5>](#module-${module.name}-relation-from)\n`;
    modulesString += ` ---\n\n`;
    modulesString += `${generateRelation(module.name, images, projectName)}\n`;
    modulesString += ` ---\n\n`;
    //modulesString += `</span>\n`;
    // 表清单
    //modulesString += `<span id="module-${module.name}-tableList">\n`;
    modulesString += ` - [<h5 id="module-${module.name}-tableList">1.${index + 1}.2 ${tableList}</h5>](#module-${module.name}-tableList-from)\n\n`;
    //modulesString += `</span>\n`;

    modulesString += ` ---\n\n`;
    modulesString += `${generateTableListTable(dataSource, module.name)}\n`;
    modulesString += ` ---\n\n`;
    // 列清单
    // 循环所有的表
    //modulesString += `<span id="module-${module.name}-tableColumnList">\n`;
    modulesString += ` - [<h5 id="module-${module.name}-tableColumnList">1.${index + 1}.3 ${tableColumnList}</h5>](#module-${module.name}-tableColumnList-from)\n\n`;
    //modulesString += `</span>\n`;
    modulesString += ` ---\n\n`;
    const entities = module.entities || [];
    entities.forEach((entity) => {
      //modulesString += `<span id="module-${module.name}-tableColumnList-${entity.title}">\n`;
      modulesString += ` - [<h6 id="module-${module.name}-tableColumnList-${entity.title}">${entity.title}【${entity.chnname || ''}】</h6>](#module-${module.name}-tableColumnList-${entity.title}-from)\n\n`;
      //modulesString += `</span>\n\n`;
      modulesString += `${generateTableColumnListTable(dataSource, module.name, entity.title)}\n`;
      modulesString += ` ---\n\n`;
    });
  });
  // 生成该模块的表列清单
  return modulesString;
};

export const generate = (dataSource, images, projectName, callBack) => {
  console.log('正在生成makedown');
  const index = '## <center>目录</center>\n';
  const header = generateHeader(dataSource);
  const body = generateModuleBody(dataSource, images, projectName);
  callBack && callBack(`${index}${header}${body}`);
};
