import create from "zustand";
import produce from "immer";

// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。


type actions = {
  setCurrentModule: (payload: any) => void,
  setCurrentEntity: (payload: any) => void,
  addTab: (payload: ModuleEntity) => void,
  activeTab: (payload: ModuleEntity) => void,
  removeTab: (payload: ModuleEntity) => void,
  removeLeftTab: (payload: ModuleEntity) => void,
  removeRightTab: (payload: ModuleEntity) => void,
  containTab: (payload: string) => boolean,
}

export type ModuleEntity = {
  module: string;
  entity: string;
}

export type TabState = {
  selectTabId: string,
  currentModule: string,
  currentEntity: string,
  tableTabs: ModuleEntity[],
  dispatch: actions
};

const useTabStore = create<TabState>(
  (set, get) => ({
    selectTabId: "all###object",
    currentModule: '',
    currentEntity: '',
    tableTabs: [],
    dispatch: {
      setCurrentModule: (payload: any) => set(produce(state => {
        state.currentModule = payload
      })),
      setCurrentEntity: (payload: any) => set(produce(state => {
        state.setCurrentEntity = payload
      })),
      addTab: (payload: ModuleEntity) => set(produce(state => {
        if (!state.tableTabs.find((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload.module)) {
          console.log('可以新增', payload)
          state.tableTabs.push(payload);
          state.selectTabId = `${payload.module}###${payload.entity}`;
        }
        console.log('state.selectTabId', state.selectTabId);
      })),
      activeTab: (payload: ModuleEntity) => set(produce(state => {
        state.selectTabId = `${payload.module}###${payload.entity}`;
        console.log('state.selectTabId', state.selectTabId)
      })),
      removeTab: (payload: ModuleEntity) => set(produce(state => {
        console.log('state.tableTabs', state.tableTabs);
        console.log('payload', payload);
        const index = state.tableTabs.findIndex((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload?.module);
        console.log('index', index);
        if (index > -1) {
          delete state.tableTabs[index];
        }
        console.log('state.tableTabs.length', state.tableTabs.length);
      })),
      removeLeftTab: (payload: ModuleEntity) => set(produce(state => {
        console.log('state.tableTabs', state.tableTabs);
        console.log('payload', payload);
        const index = state.tableTabs.findIndex((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload?.module);
        console.log('index', index);
        if (index > -1) {
          state.tableTabs.forEach((tab: ModuleEntity, i: number) => {
            if (i < index) {
              delete state.tableTabs[i];
            }
          });
        }
        console.log('state.tableTabs.length', state.tableTabs.length);
        state.selectTabId = `${payload.module}###${payload.entity}`;
        console.log('state.selectTabId', state.selectTabId);
      })),
      removeRightTab: (payload: ModuleEntity) => set(produce(state => {
        console.log('state.tableTabs', state.tableTabs);
        console.log('payload', payload);
        const index = state.tableTabs.findIndex((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload?.module);
        console.log('index', index);
        if (index > -1) {
          state.tableTabs.forEach((tab: ModuleEntity, i: number) => {
            if (i > index) {
              delete state.tableTabs[i];
            }
          });
        }
        console.log('state.tableTabs.length', state.tableTabs.length);
        state.selectTabId = `${payload.module}###${payload.entity}`;
        console.log('state.selectTabId', state.selectTabId)
      })),
      containTab: (payload: string) => {
        console.log('get().tableTabs', get().tableTabs)
        if (get().tableTabs.find((tab: ModuleEntity) => tab.entity === payload)) {
          return true;
        }
        return false;
      }
    },
  })
);

export default useTabStore;
