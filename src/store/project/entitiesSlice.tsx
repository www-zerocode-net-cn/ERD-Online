import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import {message} from "antd";

export type IEntitiesSlice = {
  currentEntity?: string;
  currentEntityIndex?: number;
}

export interface IEntitiesDispatchSlice {
  addEntity: (moduleIndex: number, payload: any) => void;
  renameEntity: (moduleIndex: number, entityIndex: number, payload: any) => void;
  removeEntity: (moduleIndex: number, index: number) => void;
  updateEntity: (moduleIndex: number, index: number, payload: any) => void;
  setCurrentEntity: (moduleIndex: number, payload: any) => void,
};

const EntitiesSlice = (set: SetState<ProjectState>) => ({
  currentEntity: '',
  currentEntityIndex: -1,
  addEntity: (moduleIndex: number, payload: any) => set(produce(state => {
    console.log('moduleIndex', moduleIndex, 15, 'payload', payload);
    console.log('addEntity', 16, state.project.projectJSON.modules[moduleIndex].entities)
    const entityIndex = state.project.projectJSON.modules[moduleIndex].entities?.findIndex((e: any) => e.title === payload.title);
    if (entityIndex === -1) {
      state.project.projectJSON.modules[moduleIndex].entities.push(payload);
      console.log('addEntity', 17, state.project.projectJSON.modules[moduleIndex].entities)
      message.success('提交成功');
    } else {
      message.warn(`${payload.title}已经存在`);
    }
  })),
  renameEntity: (moduleIndex: number, entityIndex: number, payload: any) => set(produce(state => {
    console.log(35, moduleIndex, entityIndex, payload)
    state.project.projectJSON.modules[moduleIndex].entities[entityIndex].title = payload.title;
    state.project.projectJSON.modules[moduleIndex].entities[entityIndex].chnname = payload.chnname;
    message.success('修改成功');
  })),
  removeEntity: (moduleIndex: number, entityIndex: number) => set(produce(state => {
    console.log(41, moduleIndex, entityIndex);
    state.project.projectJSON.modules[moduleIndex].entities = state.project.projectJSON.modules[moduleIndex]?.entities?.filter((e: any, index: number) => index !== entityIndex) || [];
  })),
  updateEntity: (moduleIndex: number, entityIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.modules[moduleIndex].entities[entityIndex] = payload
  })),
  setCurrentEntity: (moduleIndex: number, payload: any) => set(produce(state => {
    console.log(47, moduleIndex, payload);
    state.currentEntity = payload
    state.currentEntityIndex = state.project.projectJSON.modules[moduleIndex]?.entities.findIndex((m: any) => m.title === payload);
  })),
});


export default EntitiesSlice;
