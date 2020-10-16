import _object from 'lodash/object';


const opt = (key, menu, dataSource) => {
  // 多选操作集合目前只有复制
  // 获取多选的数据根据选中的内容执行对应的方法
  const checked = menu.checked || [];
  // 判断是数据表的复制还是数据域的复制
  const reallyKey = key.split('multiple&copy&')[1];
  const type = reallyKey.split('&')[0];
  if (type === 'datatype' || type === 'database') {
    // 1.数据域复制
    const allDatabase = _object.get(dataSource, 'dataTypeDomains.database', []);
    const allDatatypes = _object.get(dataSource, 'dataTypeDomains.datatype', []);
    let someDatabase = [];
    let someDatatypes = [];
    const checkedDatabase = checked.filter(c => c.startsWith('database&data&'));
    if (checkedDatabase.length > 0) {
      someDatabase = checkedDatabase.map((c) => {
        return allDatabase.filter(d => d.code === c.split('database&data&')[1])[0];
      });
    } else if (checked.some(c => c.split('&').length === 2 && c.startsWith('database&'))) {
      someDatabase = allDatabase;
    }
    const checkedDatatypes = checked.filter(c => c.startsWith('datatype&data&'));
    if (checkedDatatypes.length > 0) {
      someDatatypes = checkedDatatypes.map((c) => {
        return allDatatypes.filter(d => d.code === c.split('datatype&data&')[1])[0];
      });
    } else if (checked.some(c => c.split('&').length === 2 && c.startsWith('database&'))) {
      someDatatypes = allDatatypes;
    }
    const data = {
      database: someDatabase,
      datatype: someDatatypes,
    };

  } else {
    const allModules = dataSource.modules || [];
    // 2.模块和数据表同时存在的复制
    // 2.1.构造复制的数据结构与粘贴方法统一
    const checkedEntities = checked.filter(c => c.startsWith('entity&'));
    let leftEntities = [...checkedEntities];
    const checkedModulesData = checked.reduce((pre, next) => {
      if (next.startsWith('module&')){
        const name = next.split('&')[1];
        const module = allModules.filter(m => m.name === name)[0] || {};
        const some = checkedEntities
          .filter((e) => {
            if (e.split('&')[1] === name) {
              leftEntities = leftEntities.filter(le => le !== e);
              return true;
            }
            return false;
          })
          .map((e) => {
            return (module.entities || []).filter(me => me.title === e.split('&')[2])[0];
          });
        const entities = some.length > 0 ? some : (module.entities || []);
        return {
          ...pre,
          [name]: {
            ...module,
            entities,
          },
        };
      }
      return pre;
    }, {});
    const data = {
      ...checkedModulesData,
      __temp__: {
        name: '__temp__',
        entities: leftEntities.map((e) => {
          const name = e.split('&')[1];
          const module = allModules.filter(m => m.name === name)[0] || {};
          return (module.entities || []).filter(me => me.title === e.split('&')[2])[0];
        }),
      },
    };

  }
};

export default {
  opt,
};
