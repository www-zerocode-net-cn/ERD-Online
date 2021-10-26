import create from "zustand";
import produce from "immer";

export type IShortcutSlice = {
  setPanel: (panel: string) => void
}

export type ShortcutState = {
  panel: string;
  dispatch: IShortcutSlice;
}

export const PANEL = {DEFAULT: "DEFAULT", VERSION: "VERSION"};


const useShortcutStore = create<ShortcutState>(
  (set) => ({
    panel: PANEL.VERSION,
    dispatch: {
      setPanel: (panel: string) => set(produce(state => {
        state.panel = panel;
      })),
    }
  })
);

export default useShortcutStore;
