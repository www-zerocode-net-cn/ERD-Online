import React from 'react';
import _object from 'lodash/object';
import Database from './index';
import {openModal, Modal} from '../../../components';


const validateDatabase = (databases) => {
  let flag = false;
  if (databases.code && typeof databases.code === 'string') {
    flag = true;
  }
  return flag;
};

const validateDatabaseAndNewName = (databases, name) => {
  if (databases.some(database => database === name)) {
    return validateDatabaseAndNewName(databases, `${name}-副本`);
  }
  return name;
};

const updateDatatype = (datatype, oldCode, newCode) => {
  return datatype.map((type) => {
    const typeApply = type.apply || {};
    if (oldCode in typeApply) {
      typeApply[newCode] = {...typeApply[oldCode]};
      if (oldCode !== newCode) {
        delete typeApply[oldCode];
      }
    }
    return {
      ...type,
      apply: typeApply,
    };
  });
};

const checkDatabase = (database = []) => {
  if (!database.some(db => db.defaultDatabase)) {
    return database.map((db, index) => {
      if (index === 0) {
        return {
          ...db,
          defaultDatabase: true,
        };
      }
      return db;
    });
  }
  return database;
};

export const addDatabase = (dataSource, callback) => {
  openModal(<Database/>, {
    title: 'PDMan-新增数据库',
    onOk: (modal, com) => {
      const result = com.save();
      if (!result.code) {
        Modal.error({title: '新增失败', message: '数据库名不能为空'});
      } else {
        const databases = _object.get(dataSource, 'dataTypeDomains.database', []).map(database => database.code);
        const resultName = validateDatabaseAndNewName(databases, result.code);
        if (resultName !== result.code) {
          Modal.error({title: '新增失败', message: '数据库名已经存在了'});
        } else {
          modal && modal.close();
          callback && callback({
            ...dataSource,
            dataTypeDomains: {
              ...(dataSource.dataTypeDomains || {}),
              database: checkDatabase(_object.get(dataSource, 'dataTypeDomains.database', [])
                .concat(result)
                .map((data) => {
                  if (result.defaultDatabase && data.defaultDatabase
                    && (data.code !== result.code)) {
                    return {
                      ...data,
                      defaultDatabase: false,
                    };
                  }
                  return data;
                })),
            },
          });
        }
      }
    },
  });
};

export const renameDatabase = (databaseCode, dataSource, callback) => {
  const databases = _object.get(dataSource, 'dataTypeDomains.database', []);
  const value = databases.filter(data => data.code === databaseCode)[0] || {};
  openModal(<Database value={value}/>, {
    title: 'PDMan-修改数据库',
    onOk: (modal, com) => {
      const result = com.save();
      if (!result.code) {
        Modal.error({title: '修改失败', message: '数据库名不能为空'});
      } else {
        let flag = true;
        const databasesCode = databases.map(database => database.code);
        if (result.code !== value.code) {
          const resultName = validateDatabaseAndNewName(databasesCode, result.code);
          if (result.code !== resultName) {
            Modal.error({title: '修改失败', message: '数据库名已经存在了'});
            flag = false;
          }
        }
        flag && modal && modal.close();
        flag && callback && callback({
          ...dataSource,
          dataTypeDomains: {
            ...(dataSource.dataTypeDomains || {}),
            datatype: updateDatatype(_object.get(dataSource, 'dataTypeDomains.datatype', []), value.code, result.code),
            database: checkDatabase(_object.get(dataSource, 'dataTypeDomains.database', [])
              .map((data) => {
                if (data.code === value.code) {
                  return result;
                }
                return data;
              })
              .map((data) => {
                if (result.defaultDatabase && data.defaultDatabase
                  && (data.code !== result.code)) {
                  return {
                    ...data,
                    defaultDatabase: false,
                  };
                }
                return data;
              })),
          },
        });
      }
    },
  });
};

export const deleteDatabase = (databaseCode, dataSource, callback) => {
  let tempDataSource = dataSource;
  if (databaseCode) {
    tempDataSource = {
      ...tempDataSource,
      dataTypeDomains: {
        ...(dataSource.dataTypeDomains || {}),
        database: checkDatabase(_object.get(dataSource, 'dataTypeDomains.database', [])
          .filter(database => database.code !== databaseCode)),
      },
    };
  } else {
    tempDataSource = {
      ...tempDataSource,
      dataTypeDomains: {
        ...(dataSource.dataTypeDomains || {}),
        database: [],
      },
    };
  }
  callback && callback(tempDataSource);
};

export const copyDatabase = (databaseCode, dataSource) => {
  if (databaseCode) {
  } else {
  }
};

export const cutDatabase = (databaseCode, dataSource) => {
};

export const pasteDatabase = (dataSource, callback) => {
  const copyDatabaseData = [];
  let data = [];
  try {
  } catch (err) {
    console.log('数据格式错误，无法粘贴', err);
  }
  if (data.database) {
    // 提供多选复制支持
    data = data.database || [];
  }
  if (Array.isArray(data) && data.every(database => validateDatabase(database))) {
    const tempsData = data.filter(d => d.rightType === 'cut').map(d => d.code);
    const hasExistData = _object.get(dataSource, 'dataTypeDomains.database', [])
      .filter(database => !tempsData.includes(database.code));
    const hasExistDataCode = hasExistData.map(database => database.code);
    callback && callback({
      ...dataSource,
      dataTypeDomains: {
        ...(dataSource.dataTypeDomains || {}),
        database: checkDatabase(hasExistData.concat(data.map((database) => {
          const code = validateDatabaseAndNewName(
            hasExistDataCode.concat(copyDatabaseData), database.code);
          copyDatabaseData.push(code);
          return {
            ..._object.omit(database, ['rightType', 'defaultDatabase']),
            code: code,
          };
        }))),
      },
    });
  }
};
