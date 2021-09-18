import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import EntitiesSlice from "@/store/project/entitiesSlice";
import {message} from "antd";

export type IModulesSlice = {
  currentModule?: string;
  currentModuleIndex?: number;
}

export interface IModulesDispatchSlice {
  addModule: (payload: any) => void;
  renameModule: (index: number, payload: any) => void;
  removeModule: (index: number) => void;
  updateModule: (index: number, payload: any) => void;
  setCurrentModule: (payload: any) => void,
  getCurrentModuleIndex: (payload: any) => number,
};


const ModulesSlice = (set: SetState<ProjectState>) => ({
  currentModule: '',
  currentModuleIndex: -1,
  addModule: (payload: any) => set(produce(state => {
    const moduleName = payload.name;
    const findIndex = state.project.projectJSON.modules.findIndex((m: any) => m.name === moduleName);
    if (findIndex === -1) {
      state.project.projectJSON.modules.push(payload);
      message.success('提交成功');
    } else {
      message.error(`${moduleName}已经存在`);
    }
  })),
  renameModule: (index: number, payload: any) => set(produce(state => {
    state.project.projectJSON.modules[index].name = payload.name;
    state.project.projectJSON.modules[index].chnname = payload.chnname;
    message.success('修改成功');
  })),
  removeModule: (index: number) => set(produce(state => {
    delete state.project.projectJSON.modules[index];
  })),
  updateModule: (index: number, payload: any) => set(produce(state => {
    state.project.projectJSON.modules[index] = payload
  })),
  setCurrentModule: (payload: any) => set(produce(state => {
    state.currentModule = payload
    state.currentModuleIndex = state.project.projectJSON.modules?.findIndex((m: any) => m.name === payload);
  })),
  getCurrentModuleIndex: (payload: any) => set(produce(state => {
    return state.project.projectJSON.modules?.findIndex((m: any) => m.name === payload);
  })),
  ...EntitiesSlice(set),
});


export default ModulesSlice;
