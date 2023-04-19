import {GetState, SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import EntitiesSlice from "@/store/project/entitiesSlice";
import {message} from "antd";
import _ from 'lodash';
import * as cache from '../../utils/cache';


export type IModulesSlice = {
  expandedKeys?: string[];
  currentModule?: string;
  currentModuleIndex?: number;
}

const validateModule = (data: any) => {
  let flag = false;
  if (data.name && typeof data.name === 'string') {
    if (data.entities && Array.isArray(data.entities)) {
      flag = true;
    } else {
      flag = false;
    }
    // if (data.graphCanvas && typeof data.graphCanvas === 'object') {
    //   flag = true;
    // } else {
    //   flag = false;
    // }
  }
  return flag;
};


export interface IModulesDispatchSlice {
  addModule: (payload: any) => void;
  renameModule: (payload: any) => void;
  removeModule: () => void;
  updateModule: (payload: any) => void;
  copyModule: (payload: any) => void;
  cutModule: (payload: any) => void;
  pastModule: () => void;
  updateRelation: (payload: any) => void;
  setCurrentModule: (payload: any) => void,
  updateAllModules: (payload: any) => void,
  getModuleEntityTree: (searchKey: string) => any,
  getModuleEntityFieldTree: () => any,
  setExpandedKey: (expandedKey: string) => any,
  setExpandedKeys: (expandedKey: any) => any,
  getExpandedKeys: (expandedKey: any) => any,
};

const ERD_MODULE_CLIPBOARD = 'erd_module_clipboard';

const ModulesSlice = (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
  expandedKeys: [],
  currentModule: '',
  currentModuleIndex: -1,
  addModule: (payload: any) => set(produce(state => {
    const moduleName = payload.name;
    const findIndex = state.project.projectJSON?.modules?.findIndex((m: any) => m.name === moduleName);
    if (findIndex === -1) {
      state.project.projectJSON.modules.push(payload);
      message.success('操作成功');
    } else {
      message.error(`${moduleName}已经存在`);
    }
  })),
  renameModule: (payload: any) => set(produce(state => {
    const moduleName = payload.name;
    const {currentModuleIndex} = state;
    const findIndex = state.project.projectJSON?.modules?.findIndex((m: any) => m.name === moduleName);
    if (findIndex === -1) {
      state.project.projectJSON.modules[currentModuleIndex].name = payload.name;
      state.project.projectJSON.modules[currentModuleIndex].chnname = payload.chnname;
      message.success('修改成功');
    } else {
      message.error(`${moduleName}已经存在`);
    }
  })),
  removeModule: () => set(produce(state => {
    const {currentModuleIndex} = state;
    console.log(42, currentModuleIndex);
    state.project.projectJSON.modules =
      state.project.projectJSON.modules?.filter((e: any, index: number) => index !== currentModuleIndex) || [];
  })),
  updateModule: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules[state.currentModuleIndex] = payload
  })),
  copyModule: (payload: any) => set(produce(state => {
    const moduleName = payload.name;
    const currentModule = state.project.projectJSON?.modules?.find((m: any) => m.name === moduleName);
    if (currentModule) {
      cache.setItem(ERD_MODULE_CLIPBOARD, currentModule);
      message.success("复制成功")
    } else {
      message.success("复制失败")
    }
  })),
  cutModule: (payload: any) => set(produce(state => {
    const moduleName = payload.name;
    const currentModule = state.project.projectJSON?.modules?.find((m: any) => m.name === moduleName);
    console.log(85, currentModule)
    if (currentModule) {
      cache.setItem(ERD_MODULE_CLIPBOARD, currentModule);
      state.project.projectJSON.modules =
        state.project.projectJSON.modules?.filter((m: any, index: number) => m.name !== moduleName) || [];
      message.success("剪切成功")
    } else {
      message.success("剪切失败")
    }
  })),
  pastModule: () => set(state => {
    let data = {};
    try {
      data = cache.getItem2object(ERD_MODULE_CLIPBOARD) || {};
      console.log(98, data);
      // @ts-ignore
      let moduleName = data.name;
      // 判断粘贴板的数据是否符合模块的格式
      if (validateModule(data)) {
        let name = moduleName;
        while (state.project?.projectJSON?.modules.some((m: any) => m.name === moduleName)) {
          name = `${moduleName}-副本`;
          moduleName = name;
        }
        console.log(125, name,);
        state.project?.projectJSON?.modules.push({
          ...data,
          name,
          // @ts-ignore
          entities: (data.entities || []).map((entity: any) => {
            let newTitle = entity.title;
            while (state.tables.some((t: any) => t === newTitle)) {
              const title = `${newTitle}-副本`;
              newTitle = title;
            }
            state.dispatch.addProjectTableTitle(newTitle);
            return {
              ...entity,
              title: newTitle,
            };
          }),
        });
        message.success('粘贴成功');
      } else {
        message.success('粘贴失败');
      }
    } catch (err) {
      console.log('数据格式错误，无法粘贴', err);
      message.error('数据格式错误，无法粘贴');
    }
  }),
  updateRelation: (payload: any) => set(produce(state => {
    if (payload.graphCanvas) {
      state.project.projectJSON.modules[state.currentModuleIndex].graphCanvas = payload.graphCanvas;
    }
    if (payload.associations) {
      state.project.projectJSON.modules[state.currentModuleIndex].associations = payload.associations;
    }
  })),
  setCurrentModule: (payload: any) => set(produce(state => {
    state.currentModule = payload
    state.currentModuleIndex = state.project.projectJSON?.modules?.findIndex((m: any) => m?.name === payload);
  })),
  updateAllModules: (payload: any) => set(produce(state => {
    const modules = get().dispatch.fixModules(payload, null, null);
    console.log(73, 'modules', modules);
    if (modules) {
      state.project.projectJSON.modules = modules;
    }
  })),
  getModuleEntityTree: (searchKey: string) => {
    const tempExpandedKeys: any = [];
    console.log(70, get().project);
    const tableLimit = get().project?.projectJSON?.profile?.tableLimit || 15;
    let tmp_table_count=0;
    debugger

    let map = get().project.projectJSON?.modules?.map((tmpModule: any) => {
      const match_entities: any = [];
      let relation = {
        type: 'relation',
        module: tmpModule.name,
        title: '关系图',
        formatName: '关系图',
        key: `${tmpModule.name}###relation`,
        isLeaf: true
      };
      tmpModule?.entities?.some((f: any) => {
        if(tmp_table_count>=tableLimit){
          return true;
        }
        if (searchKey && searchKey.length > 0) {
          const flag = f.title.search(_.escapeRegExp(searchKey)) >= 0;
          if (flag) {
            match_entities.push(f);
            tempExpandedKeys.push(`module${tmpModule.name}`);
            tmp_table_count = tmp_table_count + 1;
          }
        } else {
          match_entities.push(f);
          tmp_table_count = tmp_table_count + 1;
        }
        return false;
      });
      let entities = match_entities.map((entity: any) => {
        const tableNameFormat = get().project?.projectJSON?.profile?.tableNameFormat || '{title} {chnname}';
        console.log(102, tableNameFormat?.render(entity))
        return {
          type: 'entity',
          module: tmpModule.name,
          length: entity?.fields?.length,
          title: entity.title,
          chnname: entity.chnname,
          formatName: tableNameFormat.render(entity),
          key: `entity${entity.title}`,
          isLeaf: true
        }
      });
      const moduleNameFormat = get().project?.projectJSON?.profile?.moduleNameFormat || '{name} {chnname}';
      return {
        type: 'tmpModule',
        formatName: moduleNameFormat.render(tmpModule),
        name: tmpModule.name,
        chnname: tmpModule.chnname,
        module: tmpModule.name,
        length: tmpModule?.entities?.length,
        title: tmpModule.name,
        key: `module${tmpModule.name}`,
        children: _.concat(relation, entities)
      }
    });

    console.log(82, 'getModuleEntityTree', map);
    return map;
  },
  getModuleEntityFieldTree: () => set(produce(state => {
    return state.project?.projectJSON?.modules?.map((module: any) => {
      let relation = {type: 'relation', title: '关系图', key: `${module.name}###relation`, isLeaf: true};
      let entities = module?.entities?.map((entity: any) => {
        return {type: 'entity', title: entity.title, key: entity.title, isLeaf: true}
      });
      return {
        type: 'module',
        title: module.name,
        key: module.name,
        children: _.concat(relation, entities)
      }
    });
  })),
  setExpandedKey: (expandedKey: string) => set(produce(state => {
    console.log(129, get());
    // state.expandedKeys?.push(expandedKey);
  })),
  setExpandedKeys: (expandedKeys: any) => set(produce(state => {
    state.expandedKeys = expandedKeys;
  })),
  getExpandedKeys: (searchKey: string) => {
    const tempExpandedKeys: any = [];
    console.log(70, get().project)
    get().project.projectJSON?.modules?.forEach((module: any) => {
      module?.entities?.filter((f: any) => {
        if (searchKey && searchKey.length > 0) {
          const flag = f.title.search(_.escapeRegExp(searchKey)) >= 0;
          if (flag) {
            tempExpandedKeys.push(`module${module.name}`);
          }
          return flag
        } else {
          return true;
        }
      })
    });
    console.log(155, 'tempExpandedKeys', tempExpandedKeys);
    return tempExpandedKeys;
  },
  ...EntitiesSlice(set),
});


export default ModulesSlice;
