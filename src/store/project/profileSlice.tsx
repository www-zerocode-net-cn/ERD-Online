import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";

export type IProfileSlice={}

export interface IProfileDispatchSlice {
  addDefaultFields: (defaultFieldsIndex: number,payload: any) => void;
  removeDefaultFields: (defaultFieldsIndex: number) => void;
  updateDefaultFields: (defaultFieldsIndex: number, payload: any) => void;

  updateDefaultFieldsType: (payload: any) => void;
  updateSqlConfig: (payload: any) => void;

  addDbs: (defaultFieldsIndex: number,payload: any) => void;
  removeDbs: (defaultFieldsIndex: number,index: number) => void;
  updateDbs: (defaultFieldsIndex: number,index: number, payload: any) => void;

  updateWordTemplateConfig: (payload: any) => void;
};

const ProfileSlice = (set: SetState<ProjectState>) => ({
  addDefaultFields: (defaultFieldsIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.defaultFields[defaultFieldsIndex].push(payload);
  })),
  removeDefaultFields: (defaultFieldsIndex: number) => set(produce(state => {
    delete state.project.projectJSON.profile.defaultFields[defaultFieldsIndex];
  })),
  updateDefaultFields: (defaultFieldsIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.defaultFields[defaultFieldsIndex] = payload;
  })),

  updateDefaultFieldsType: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.defaultFieldsType = payload;
  })),
  updateSqlConfig: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.sqlConfig = payload;
  })),

  addDbs: (defaultFieldsIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs[defaultFieldsIndex].push(payload);
  })),
  removeDbs: (defaultFieldsIndex: number) => set(produce(state => {
    delete state.project.projectJSON.profile.dbs[defaultFieldsIndex];
  })),
  updateDbs: (defaultFieldsIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs[defaultFieldsIndex] = payload;
  })),

  updateWordTemplateConfig: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.wordTemplateConfig = payload;
  })),
});


export default ProfileSlice;
