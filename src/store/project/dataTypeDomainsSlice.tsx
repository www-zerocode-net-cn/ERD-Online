import {SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import {message} from "antd";

export type IDataTypeDomainsSlice = {
  currentDataType?: string;
  currentDataTypeIndex?: number;
}

export interface IDataTypeDomainsDispatchSlice {

  addDatatype: (payload: any) => void;
  renameDatatype: (payload: any) => void;
  removeDatatype: () => void;
  updateDatatype: (payload: any) => void;
  setCurrentDatatype: (payload: any) => void,
};

const DataTypeDomainsSlice = (set: SetState<ProjectState>) => ({
  addDatatype: (payload: any) => set(produce(state => {
    const datatypeName = payload.name;
    console.log('datatypeName', 29, datatypeName);
    console.log('code', 29, payload.code);
    console.log('state.currentDataTypeIndex', 29, state.currentDataTypeIndex);
    const findIndex = state.project.projectJSON.dataTypeDomains?.datatype?.findIndex((m: any) => m.name === datatypeName || m.code === payload.code);
    console.log('findIndex', 31, findIndex)
    console.log('dataType', 32, state.project.projectJSON.dataTypeDomains?.datatype)
    if (findIndex === -1) {
      state.project.projectJSON.dataTypeDomains?.datatype?.push(payload);
      message.success('提交成功');
    } else {
      message.error(`名称[${payload.name}] 或 代码[${payload.code}] 已经存在`);
    }
  })),
  renameDatatype: (payload: any) => set(produce(state => {
    const {currentDataTypeIndex} = state;
    state.project.projectJSON.dataTypeDomains.datatype[currentDataTypeIndex].name = payload.name;
    state.project.projectJSON.dataTypeDomains.datatype[currentDataTypeIndex].code = payload.code;
    state.project.projectJSON.dataTypeDomains.datatype[currentDataTypeIndex].apply = payload.apply;
    message.success('修改成功');
  })),
  removeDatatype: () => set(produce(state => {
    const {currentDataTypeIndex} = state;
    console.log(46, currentDataTypeIndex);
    state.project.projectJSON.dataTypeDomains.datatype =
      state.project.projectJSON.dataTypeDomains?.datatype?.filter((e: any, index: number) => index !== currentDataTypeIndex) || [];
  })),
  updateDatatype: (payload: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains.datatype[state.currentDataTypeIndex] = payload;
    message.success('修改成功');
  })),
  setCurrentDatatype: (payload: any) => set(produce(state => {
    state.currentDataType = payload
    state.currentDataTypeIndex = state.project.projectJSON.dataTypeDomains?.datatype?.findIndex((m: any) => m.code === payload);
  })),
});


export default DataTypeDomainsSlice;
