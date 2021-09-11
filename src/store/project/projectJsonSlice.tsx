import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useStore";
import produce from "immer";


export interface IProjectJsonSlice {
  setProjectJson: (value: any) => void;
};

const ProjectJsonSlice = (set: SetState<ProjectState>) => ({
  setProjectJson: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  }))
});


export default ProjectJsonSlice;
