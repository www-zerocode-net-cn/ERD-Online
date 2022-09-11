import {GetState, SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import {message} from "antd";
import _ from "lodash";

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
  updateAllDataTypes: (payload: any) => void,
  getDataTypeTree: (searchKey: string) => any,

}

const DataTypeDomainsSlice = (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
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
  updateAllDataTypes: (payload: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains.datatype = payload;
  })),
  getDataTypeTree: (searchKey: string) => {
    console.log(70, get().project)

    let dataTypes = get().project?.projectJSON?.dataTypeDomains?.datatype?.map((datatype: any) => {
      return {
        type: 'dataType',
        code: datatype.code,
        title: datatype.name,
        isLeaf: true,
        key: `datatype${datatype.name}`,
      }
    });
    let databases = get().project?.projectJSON?.dataTypeDomains?.database?.map((database: any) => {
      return {
        type: 'database',
        code: database.code,
        title: database.code,
        isLeaf: true,
        key: `database${database.code}`,
      }
    });
    console.log(73, 'getDataTypeTree', dataTypes,databases);

    return [{
      type: 'dataType',
      title: '字段类型',
      code: '###menu###',
      isLeaf: false,
      key: `datatype###datatype`,
      children: dataTypes
    },{
      type: 'database',
      code: '###menu###',
      title: '数据源',
      isLeaf: false,
      key: `database###database`,
      children: databases
    }];
  },
});


export default DataTypeDomainsSlice;
