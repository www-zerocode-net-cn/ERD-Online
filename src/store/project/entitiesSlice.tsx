import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";


export interface IEntitiesSlice {
  addEntity: (moduleIndex: number,payload: any) => void;
  removeEntity: (moduleIndex: number,index: number) => void;
  updateEntity: (moduleIndex: number,index: number, payload: any) => void;
};

const EntitiesSlice = (set: SetState<ProjectState>) => ({
  addEntity: (moduleIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.modules[moduleIndex].push(payload);
  })),
  removeEntity: (moduleIndex: number, entityIndex: number) => set(produce(state => {
    delete state.project.projectJSON.modules[moduleIndex].entities[entityIndex];
  })),
  updateEntity: (moduleIndex: number, entityIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.modules[moduleIndex].entities[entityIndex] = payload
  })),
});


export default EntitiesSlice;
