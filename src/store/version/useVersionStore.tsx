import create from "zustand";

export type IVersionSlice = {}

export type VersionState =
  {

    dispatch: IVersionSlice;
  }


const useVersionStore = create<VersionState>(
  (set) => ({
    dispatch: {}
  })
);

export default useVersionStore;
