import create from "zustand";
import produce from "immer";

export type IGlobalSlice = {
  setSaved: (saved: boolean) => void
}

export type GlobalState = {
  saved: boolean;
  dispatch: IGlobalSlice;
}


const useGlobalStore = create<GlobalState>(
  (set) => ({
    saved: true,
    dispatch: {
      setSaved: (saved: boolean) => set(produce(state => {
        state.saved = saved;
      })),
    }
  })
);

export default useGlobalStore;
