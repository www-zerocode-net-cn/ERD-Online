import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useStore";
import produce from "immer";

export interface IConfigJsonSlice {
  setConfigJson: (value: any) => void;
};

const ConfigJsonSlice = (set: SetState<ProjectState>) => ({
  setConfigJson: (value: any) => set(produce(state => {
    state.project.configJSON = value
  }))
});


export default ConfigJsonSlice;
