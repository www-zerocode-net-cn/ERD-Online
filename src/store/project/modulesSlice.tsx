import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import EntitiesSlice from "@/store/project/entitiesSlice";
import {message} from "antd";
import _ from 'lodash';

export type IModulesSlice = {
  currentModule?: string;
  currentModuleIndex?: number;
}

export interface IModulesDispatchSlice {
  addModule: (payload: any) => void;
  renameModule: (payload: any) => void;
  removeModule: () => void;
  updateModule: (payload: any) => void;
  updateRelation: (payload: any) => void;
  setCurrentModule: (payload: any) => void,
  updateAllModules: (payload: any) => void,
  getModuleEntityTree: () => any,
  getModuleEntityFieldTree: () => any,
};


const ModulesSlice = (set: SetState<ProjectState>) => ({
  currentModule: '',
  currentModuleIndex: -1,
  addModule: (payload: any) => set(produce(state => {
    const moduleName = payload.name;
    const findIndex = state.project.projectJSON?.modules?.findIndex((m: any) => m.name === moduleName);
    if (findIndex === -1) {
      state.project.projectJSON.modules.push(payload);
      message.success('提交成功');
    } else {
      message.error(`${moduleName}已经存在`);
    }
  })),
  renameModule: (payload: any) => set(produce(state => {
    const {currentModuleIndex} = state;
    state.project.projectJSON.modules[currentModuleIndex].name = payload.name;
    state.project.projectJSON.modules[currentModuleIndex].chnname = payload.chnname;
    message.success('修改成功');
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
    state.project.projectJSON.modules = payload;
  })),
  getModuleEntityTree: () => set(produce(state => {
    let map = state.project?.projectJSON?.modules?.map((module: any) => {
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
    console.log(82, 'getModuleEntityTree', map);
    return map;
  })),
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
  ...EntitiesSlice(set),
});


export default ModulesSlice;
