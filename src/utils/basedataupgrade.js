import _object from 'lodash/object';
import defaultData from '../app/defaultData';

const upgradeVersionTo2 = (dataSource, cb) => {
  // v2.0.0 bate 当前版本新增了多个模板信息，之前版本的template已经弃用
  // 新增 createTableTemplate
  // 新增 deleteTableTemplate
  // 新增 rebuildTableTemplate
  // 新增 createFieldTemplate
  // 新增 updateFieldTemplate
  // 新增 deleteFieldTemplate
  // 新增 deleteIndexTemplate
  // 新增 createIndexTemplate
  // 新增 updateTableComment
  const newTemplate = ['createTableTemplate', 'deleteTableTemplate', 'rebuildTableTemplate',
    'createFieldTemplate', 'updateFieldTemplate', 'deleteFieldTemplate',
    'deleteIndexTemplate', 'createIndexTemplate', 'updateTableComment'];
  const dbs = _object.get(dataSource, 'dataTypeDomains.database', []);
  let flag = false;
  let tempDataSource = {
    ...dataSource,
    dataTypeDomains: {
      ...(dataSource.dataTypeDomains || {}),
      database: dbs.map((db) => {
        const tempDB = {...db};
        const currentDBs = _object.get(defaultData, 'profile.defaultDataTypeDomains.database', []);
        const currentDB = currentDBs
          .filter(cdb => cdb.code.toLocaleLowerCase() === tempDB.code.toLocaleLowerCase())[0];
        if (currentDB) {
          newTemplate.forEach((t) => {
            // 如果该模板未定义，只使用默认模板。其他情况无需更新此模板
            if (tempDB[t] === undefined) {
              // 获取默认模板的数据库信息
              // 设置状态，表示有内容需要写入到老版本
              flag = true;
              tempDB[t] = currentDB[t] || '';
            }
          });
        }
        return tempDB;
      }),
    },
  };
  // 批量更新当前版本的箭头数据
  tempDataSource = flag ? tempDataSource : dataSource;
  tempDataSource = {
    ...tempDataSource,
    modules: (tempDataSource.modules || []).map((m) => {
      return {
        ...m,
        graphCanvas: {
          ...(m.graphCanvas || {}),
          edges: _object.get(m, 'graphCanvas.edges', []).map((e) => {
            if (e.shape === 'polyLineFlow') {
              flag = true;
              return {
                ...e,
                shape: 'erdRelation',
              };
            }
            return e;
          }),
        },
      };
    }),
  };


  // 更新结束
  cb && cb(tempDataSource, flag);
};

// 版本升级脚本
export const upgrade = (dataSource, cb) => {
  // 2.0之前项目更新模板信息
  upgradeVersionTo2(dataSource, cb);
  // ...
};

