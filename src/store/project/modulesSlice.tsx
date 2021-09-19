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
  renameModule: (payload: any) => void;
  removeModule: () => void;
  updateModule: (payload: any) => void;
  setCurrentModule: (payload: any) => void,
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
  setCurrentModule: (payload: any) => set(produce(state => {
    state.currentModule = payload
    state.currentModuleIndex = state.project.projectJSON.modules?.findIndex((m: any) => m.name === payload);
  })),
  ...EntitiesSlice(set),
});


export default ModulesSlice;
