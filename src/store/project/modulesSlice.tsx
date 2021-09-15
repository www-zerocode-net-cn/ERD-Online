import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import EntitiesSlice from "@/store/project/entitiesSlice";


export interface IModulesSlice {
  addModule: (payload: any) => void;
  removeModule: (index: number) => void;
  updateModule: (index: number, payload: any) => void;
};

const ModulesSlice = (set: SetState<ProjectState>) => ({
  addModule: (payload: any) => set(produce(state => {
    state.project.projectJSON.modules.push(payload);
  })),
  removeModule: (index: number) => set(produce(state => {
    delete state.project.projectJSON.modules[index];
  })),
  updateModule: (index: number, payload: any) => set(produce(state => {
    state.project.projectJSON.modules[index] = payload
  })),
  ...EntitiesSlice(set),
});


export default ModulesSlice;
