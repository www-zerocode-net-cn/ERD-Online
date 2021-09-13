import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";


export interface IDataTypeDomainsSlice {

  addDatatype: (payload: any) => void;
  removeDatatype: (index: number) => void;
  updateDatatype: (index: number, payload: any) => void;
  addDatabase: (payload: any) => void;
  removeDatabase: (index: number) => void;
  updateDatabase: (index: number, payload: any) => void;
};

const DataTypeDomainsSlice = (set: SetState<ProjectState>) => ({
  addDatatype: (dataTypeIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains.dataType[dataTypeIndex].push(payload);
  })),
  removeDatatype: (dataTypeIndex: number) => set(produce(state => {
    delete state.project.projectJSON.dataTypeDomains.dataType[dataTypeIndex];
  })),
  updateDatatype: (dataTypeIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains.dataType[dataTypeIndex] = payload
  })),
  addDatabase: (dataTypeIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains.database[dataTypeIndex].push(payload);
  })),
  removeDatabase: (dataTypeIndex: number) => set(produce(state => {
    delete state.project.projectJSON.dataTypeDomains.database[dataTypeIndex];
  })),
  updateDatabase: (dataTypeIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains.database[dataTypeIndex] = payload
  })),
});


export default DataTypeDomainsSlice;
