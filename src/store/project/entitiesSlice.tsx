import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import {message} from "antd";
import useShortcutStore, {PANEL} from "@/store/shortcut/useShortcutStore";

export type IEntitiesSlice = {
  currentEntity?: string;
  currentEntityIndex?: number;
}

export interface IEntitiesDispatchSlice {
  addEntity: (payload: any) => void;
  renameEntity: (payload: any) => void;
  removeEntity: () => void;
  removeIndex: (index: number) => void;
  updateEntity: (payload: any) => void;
  updateEntityFields: (payload: any) => void;
  updateEntityIndex: (payload: any) => void;
  moveField: (payload: any, startRow: number, endRow: number) => void;
  setCurrentEntity: (payload: any) => void,
  setCurrentModuleAndEntity: (module: any, entity: any) => void,
};

const shortcutState = useShortcutStore.getState();

const EntitiesSlice = (set: SetState<ProjectState>) => ({
  currentEntity: '',
  currentEntityIndex: -1,
  addEntity: (payload: any) => set(produce(state => {
    const {currentModuleIndex} = state;
    console.log('state.currentModuleIndex', currentModuleIndex, 15, 'payload', payload);
    console.log('addEntity', 16, state.project.projectJSON.modules[currentModuleIndex].entities)
    const entityIndex = state.project.projectJSON.modules[currentModuleIndex].entities?.findIndex((e: any) => e.title === payload.title);
    if (entityIndex === -1) {
      state.project.projectJSON.modules[currentModuleIndex].entities.push(payload);
      console.log('addEntity', 17, state.project.projectJSON.modules[currentModuleIndex].entities)
      message.success('提交成功');
    } else {
      message.warn(`${payload.title}已经存在`);
    }
  })),
  renameEntity: (payload: any) => set(produce(state => {
    const {currentEntityIndex} = state;
    console.log(35, state.currentModuleIndex, currentEntityIndex, payload)
    state.project.projectJSON.modules[state.currentModuleIndex].entities[currentEntityIndex].title = payload.title;
    state.project.projectJSON.modules[state.currentModuleIndex].entities[currentEntityIndex].chnname = payload.chnname;
    message.success('修改成功');
  })),
  removeIndex: (index: number) => set(produce(state => {
    const {currentModuleIndex,currentEntityIndex} = state;
    console.log(49, state.currentModuleIndex, currentEntityIndex, index)
    state.project.projectJSON.modules[currentModuleIndex].entities[currentEntityIndex].indexs =
      state.project.projectJSON.modules[currentModuleIndex]?.entities[currentEntityIndex].indexs.filter((e: any, i: number) => i !== index) || [];
    message.success('删除成功');
  })),
  removeEntity: () => set(produce(state => {
    const {currentModuleIndex} = state;
    state.project.projectJSON.modules[currentModuleIndex].entities =
      state.project.projectJSON.modules[currentModuleIndex]?.entities?.filter((e: any, index: number) => index !== state.currentEntityIndex) || [];
  })),
  updateEntity: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].fields = payload;
  })),
  updateEntityFields: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].fields = payload;
  })),
  updateEntityIndex: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].indexs = payload;
  })),
  moveField: (payload: any, startRow: number, endRow: number) => set(produce(state => {
    if (startRow < endRow) {
      // eslint-disable-next-line no-param-reassign
      endRow -= 1;
    }
    payload.splice(endRow, 0, payload.splice(startRow, 1)[0]);
    state.project.projectJSON.modules[state.currentModuleIndex].entities[state.currentEntityIndex].fields = payload;
  })),
  setCurrentEntity: (payload: any) => set(produce(state => {
    const {currentModuleIndex} = state;
    console.log(47, currentModuleIndex, payload);
    state.currentEntity = payload
    state.currentEntityIndex = state.project.projectJSON.modules[currentModuleIndex]?.entities.findIndex((m: any) => m.title === payload);
    shortcutState.dispatch.setPanel(PANEL.DEFAULT);
  })),
  setCurrentModuleAndEntity: (module: any, entity: any) => set(produce(state => {
    console.log(54, module, entity);
    state.currentModule = module;
    const currentModuleIndex = state.project.projectJSON.modules?.findIndex((m: any) => m.name === module);
    state.currentModuleIndex = currentModuleIndex;
    state.currentEntity = entity;
    state.currentEntityIndex = state.project.projectJSON.modules[currentModuleIndex]?.entities.findIndex((m: any) => m.title === entity);
    shortcutState.dispatch.setPanel(PANEL.DEFAULT);
  })),
});


export default EntitiesSlice;
