import create from "zustand";
import produce from "immer";

// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。


type actions = {
  addTab: (payload: ModuleEntity) => void,
  activeTab: (payload: ModuleEntity) => void,
  removeTab: (payload: ModuleEntity) => void,
  removeLeftTab: (payload: ModuleEntity) => void,
  removeRightTab: (payload: ModuleEntity) => void,
  removeAllTab: (payload: ModuleEntity) => void,
  containTab: (payload: string) => boolean,
}

export type ModuleEntity = {
  module?: string;
  entity?: string;
}

export type TabState = {
  selectTabId: string,
  tableTabs: ModuleEntity[],
  dispatch: actions
};

export const defaultSelectTabId = 'all###object';

const useTabStore = create<TabState>(
  (set, get) => ({
    selectTabId: defaultSelectTabId,
    tableTabs: [],
    dispatch: {
      addTab: (payload: ModuleEntity) => set(produce(state => {
        if (!state.tableTabs.find((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload.module)) {
          console.log('可以新增', payload)
          state.tableTabs.push(payload);
        }
        state.selectTabId = `${payload.module}###${payload.entity}`;
        console.log('state.selectTabId', state.selectTabId);
      })),
      activeTab: (payload: ModuleEntity) => set(produce(state => {
        state.selectTabId = `${payload.module}###${payload.entity}`;
        console.log('state.selectTabId', state.selectTabId)
      })),
      removeTab: (payload: ModuleEntity) => set(produce(state => {
        console.log('removeTab.state.tableTabs', state.tableTabs);
        console.log('removeTab.payload', payload);
        const index = state.tableTabs.findIndex((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload?.module);
        console.log('removeTab.index', index);
        if (index > -1) {
          state.tableTabs = state.tableTabs.filter((tab: ModuleEntity, i: number) => i !== index);
          console.log('removeTab.selectTabId', get().selectTabId);
          console.log('removeTab.payloadEntity', `${payload?.module}###${payload?.entity}`);
          if (get().selectTabId === `${payload?.module}###${payload?.entity}`) {
            if (index === 0) {
              state.selectTabId = defaultSelectTabId;
            } else if (index > 0) {
              console.log('removeTab.number', index);
              const tableTab = state.tableTabs[index - 1];
              state.selectTabId = `${tableTab?.module}###${tableTab?.entity}`;
            }
          }

        }
        console.log('removeTab.state.tableTabs.length', state.tableTabs.length);
        console.log('removeTab.state.tableTabs', state.tableTabs);
      })),
      removeLeftTab: (payload: ModuleEntity) => set(produce(state => {
        console.log('state.tableTabs', state.tableTabs);
        console.log('payload', payload);
        const index = state.tableTabs.findIndex((tab: ModuleEntity) => tab?.entity === payload.entity && tab?.module === payload?.module);
        console.log('index', index);
        if (index > -1) {
          state.tableTabs = state.tableTabs.filter((tab: ModuleEntity, i: number) => i >= index);
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
          state.tableTabs = state.tableTabs.filter((tab: ModuleEntity, i: number) => i <= index);
        }
        console.log('state.tableTabs.length', state.tableTabs.length);
        state.selectTabId = `${payload.module}###${payload.entity}`;
        console.log('state.selectTabId', state.selectTabId)
      })),
      removeAllTab: (payload: ModuleEntity) => set(produce(state => {
        console.log('payload', 110, payload)
        state.tableTabs = [];
        state.selectTabId = defaultSelectTabId;
        console.log('state.tableTabs.length', state.tableTabs.length);
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
