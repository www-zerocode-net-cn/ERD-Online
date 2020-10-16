import React from 'react';
import _object from 'lodash/object';
// import * as json from '../../../utils/json';
import { openModal, Input, Modal } from '../../../components';


class ModuleForm extends React.Component{
  render() {
    const { onChange, validate, defaultValue } = this.props;
    return (
      <div>
        <div style={{display: 'flex', padding: 5}}>
          <span style={{width: 100, textAlign: 'right', paddingRight: 5}}>
            模块名:
          </span>
          <Input
            autoFocus
            style={{width: 'calc(100% - 100px)'}}
            validate={validate}
            onChange={e => onChange('name', e)}
            defaultValue={defaultValue.name}
          />
        </div>
        <div style={{display: 'flex', padding: 5}}>
          <span style={{width: 100, textAlign: 'right', paddingRight: 5}}>
            中文名:
          </span>
          <Input
            style={{width: 'calc(100% - 100px)'}}
            onChange={e => onChange('chnname', e)}
            defaultValue={defaultValue.chnname}
          />
        </div>
      </div>
    );
  }
}

const getAllTable = (dataSource) => {
  return (dataSource.modules || []).reduce((a, b) => {
    return a.concat((b.entities || []).map(entity => entity.title));
  }, []);
};
const validateModule = (data) => {
  let flag = false;
  if (data.name && typeof data.name === 'string') {
    if (data.entities && Array.isArray(data.entities)) {
      flag = true;
    } else {
      flag = false;
    }
    if (data.graphCanvas && typeof data.graphCanvas === 'object') {
      flag = true;
    } else {
      flag = false;
    }
  }
  return flag;
};
const validateModuleAndNewName = (modules = [], name) => {
  if (modules.some(module => module === name)) {
    return validateModuleAndNewName(modules, `${name}-副本`);
  }
  return name;
};

export const addModule = (dataSource, cb) => {
  // 新增模块
  // 1.弹窗输入信息
  // 2.保存输入的信息，触发回调
  let tempModuleName = '';
  let tempModuleChnname = '';
  let flag = true;
  const onChange = (name, e) => {
    if (name === 'name') {
      tempModuleName = e.target.value;
    } else {
      tempModuleChnname = e.target.value;
    }
  };
  const modules = (dataSource.modules || []).map(module => module.name);
  const validate = () => {
    const resultName = validateModuleAndNewName(modules, tempModuleName);
    flag = true;
    if (resultName !== tempModuleName) {
      flag = false;
      return '模块名已经存在了';
    } else if (!tempModuleName) {
      flag = false;
      return '模块名不能为空';
    }
    return '';
  };
  openModal(<ModuleForm
    validate={validate}
    onChange={onChange}
    defaultValue={{name: '', chnname: ''}}
  />, {
    title: 'PDMan-新增模块',
    onOk: (modal) => {
      // 1.修改dataSource
      if (!tempModuleName) {
        Modal.error({title: '新增失败', message: '模块名不能为空'});
      } else if(tempModuleName.includes('/') || tempModuleName.includes('&') || tempModuleName.includes(':')) {
        Modal.error({title: '新增失败', message: '模块名不能包含/或者&或者:'});
      } else {
        tempModuleName && flag && modal && modal.close();
        tempModuleName && flag && cb && cb({
          ...dataSource,
          modules: (dataSource.modules || []).concat({
            name: tempModuleName,
            chnname: tempModuleChnname,
            entities: [],
            graphCanvas: {},
          }),
        });
      }
    },
  });
};

export const renameModule = (oldName, dataSource, cb) => {
  const modules = dataSource.modules || [];
  const oldModuleData = modules.filter(m => m.name === oldName)[0];
  const oldModuleChnname = (oldModuleData && oldModuleData.chnname) || '';
  // 模块重命名
  let tempModuleName = oldName;
  let tempModuleChnname = oldModuleChnname;
  const onChange = (name, e) => {
    if (name === 'name') {
      tempModuleName = e.target.value;
    } else {
      tempModuleChnname = e.target.value;
    }
  };
  const moduleNames = modules.map(module => module.name);
  let flag = true;
  const validate = () => {
    const resultName = validateModuleAndNewName(moduleNames, tempModuleName);
    flag = true;
    if (resultName !== tempModuleName) {
      flag = false;
      return '模块名已经存在了';
    } else if (!tempModuleName) {
      flag = false;
      return '模块名不能为空';
    }
    return '';
  };
  openModal(<ModuleForm
    validate={validate}
    onChange={onChange}
    defaultValue={{name: oldName, chnname: tempModuleChnname}}
  />, {
    title: 'PDMan-重命名模块',
    onOk: (modal) => {
      // 1.修改dataSource
      if (tempModuleName === oldName && tempModuleChnname === oldModuleChnname) {
        Modal.error({title: '重命名失败', message: '模块信息不能与旧信息相同'});
      } else if (tempModuleName.includes('/') || tempModuleName.includes('&') || tempModuleName.includes(':')) {
        Modal.error({title: '重命名失败', message: '模块名不能包含/或者&或者:'});
      } else {
        flag && modal && modal.close();
        flag && cb && cb({
          ...dataSource,
          modules: (dataSource.modules || []).map((module) => {
            if (module.name === oldName) {
              return {
                ...module,
                name: tempModuleName,
                chnname: tempModuleChnname,
              };
            }
            return {
              ...module,
            };
          }),
        }, tempModuleName);
      }
    },
  });
};

export const deleteModule = (name, dataSource, cb) => {
  // 删除模块
  cb && cb({
    ...dataSource,
    modules: (dataSource.modules || []).filter(module => module.name !== name),
  });
};

export const copyModule = (name, dataSource) => {
  // 复制模块
};

export const cutModule = (name, dataSource) => {
  // 剪切模块
};

export const pasteModule = (dataSource, cb) => {
  const copyTables = [];
  const copyModules = [];
  // 粘贴模块
  let data = {};
  try {
    data = '';
  } catch (err) {
    console.log('数据格式错误，无法粘贴', err);
  }
  const paste = (d, modules) => {
    // 判断粘贴板的数据是否符合模块的格式
    if (validateModule(d)) {
      const name = validateModuleAndNewName(
        (dataSource.modules || []).map(module => module.name)
          .filter(module => !(d.rightType === 'cut' && module === d.name)).concat(copyModules), d.name);
      copyModules.push(name);
      return modules.filter(module => !(d.rightType === 'cut' && module.name === d.name))
        .concat({
          ..._object.omit(d, ['rightType']),
          name,
          entities: (d.entities || []).map((entity) => {
            const newTitle =
              validateModuleAndNewName(getAllTable(dataSource).concat(copyTables), entity.title);
            copyTables.push(newTitle);
            return {
              ...entity,
              title: newTitle,
            };
          }),
        });
    }
    console.log('无效的数据格式');
    return modules;
  };
  if (data.__temp__) {
    data = Object.keys(_object.omit(data, ['__temp__'])).map(name => data[name]);
  } else {
    data = [].concat(data);
  }
  let modules = [...(dataSource.modules || [])];
  data.forEach((d) => {
    modules =  paste(d, modules);
  });
  cb && cb({...dataSource, modules});
};
