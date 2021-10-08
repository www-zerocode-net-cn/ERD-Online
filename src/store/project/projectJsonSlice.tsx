import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import ModulesSlice from "@/store/project/modulesSlice";
import DataTypeDomainsSlice from "@/store/project/dataTypeDomainsSlice";
import ProfileSlice from "@/store/project/profileSlice";
import DatabaseDomainsSlice from "@/store/project/databaseDomainsSlice";

export type IProjectJsonSlice={}

export interface IProjectJsonDispatchSlice {
  setModules: (value: any) => void;
  setDataTypeDomains: (value: any) => void;
  setProfile: (value: any) => void;
};

const ProjectJsonSlice = (set: SetState<ProjectState>) => ({
  setModules: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  setDataTypeDomains: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  setProfile: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  ...ModulesSlice(set),
  ...DataTypeDomainsSlice(set),
  ...DatabaseDomainsSlice(set),
  ...ProfileSlice(set),
});


export default ProjectJsonSlice;
