import create from "zustand";
import produce from "immer";

export type IGlobalSlice = {
  setSaved: (saved: boolean) => void
  setNeedSave: (saved: boolean) => void
  setSearchKey: (searchKey: string) => void
  setExpandedKeys: (expandedKeys: string[]) => void
}

export type GlobalState = {
  expandedKeys?: any;
  searchKey?: string;
  querySearchKey?: string;
  saved: boolean;
  needSave: boolean;
  dispatch: IGlobalSlice;
}


const useGlobalStore = create<GlobalState>(
  (set) => ({
    expandedKeys: [],
    searchKey: '',
    querySearchKey: '',
    saved: true,
    needSave: true,
    dispatch: {
      setSaved: (saved: boolean) => set(produce(state => {
        state.saved = saved;
      })),
      setNeedSave: (needSave: boolean) => set(produce(state => {
        state.needSave = needSave;
      })),
      setSearchKey: (searchKey: string) => set(produce(state => {
        state.searchKey = searchKey;
      })),
      setExpandedKeys: (expandedKeys: string[]) => set(produce(state => {
        state.expandedKeys = expandedKeys;
      })),
    }
  })
);

export default useGlobalStore;
