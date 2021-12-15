import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import _ from "lodash";

export type IProfileSlice = {
  currentDbKey?: string;
}

export interface IProfileDispatchSlice {
  addDefaultFields: (defaultFieldsIndex: number, payload: any) => void;
  removeDefaultFields: (defaultFieldsIndex: number) => void;
  updateDefaultFields: (defaultFieldsIndex: number, payload: any) => void;

  updateDefaultFieldsType: (payload: any) => void;
  updateSqlConfig: (payload: any) => void;

  addDbs: (payload: any) => void;
  removeDbs: (key: string) => void;
  updateDbs: (key: string, payload: any) => void;
  updateAllDbs: (payload: any) => void;
  setCurrentDbKey: (payload: string) => void;
  setDefaultDb: (payload: string) => void;

  updateWordTemplateConfig: (payload: any) => void;
}

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

  addDbs: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs.push(payload);
  })),
  removeDbs: (key: string) => set(produce(state => {
    state.project.projectJSON.profile.dbs = state.project.projectJSON?.profile?.dbs?.filter((db: any) => db.key !== key);
    console.log(56, state.project.projectJSON?.profile?.dbs);
  })),
  updateDbs: (key: string, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs = state.project.projectJSON?.profile?.dbs?.map((db: any) => {
      console.log(54, key, payload)
      console.log(55, state.currentDbKey)
      if (db.defaultDB) {
        return {
          ...db,
          [key]: payload
        };
      } else {
        return db;
      }
    });
    console.log(64, state.project.projectJSON?.profile?.dbs);

  })),
  updateAllDbs: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs = payload;
  })),
  setCurrentDbKey: (payload: string) => set(produce(state => {
    state.currentDbKey = payload;
  })),
  setDefaultDb: (payload: string) => set(produce(state => {
    console.log(74, 'defaultDbIndex', payload);
    state.project.projectJSON.profile.dbs = state.project.projectJSON?.profile?.dbs?.map((db: any) => {
      console.log(76, 'db.key', db.key)
      if (db.key === payload) {
        state.currentDbKey = db.key;
        return {
          ...db,
          defaultDB: true
        };
      } else {
        return {
          ...db,
          defaultDB: false
        };
      }
    });
    console.log(70, state.project.projectJSON?.profile?.dbs);
  })),

  updateWordTemplateConfig: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.wordTemplateConfig = payload;
  })),
});


export default ProfileSlice;
