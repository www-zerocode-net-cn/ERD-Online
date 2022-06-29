import create from "zustand";
import produce from "immer";

export type IShortcutSlice = {
  setPanel: (panel: string) => void;
  setShow: (show: boolean) => void;
}

export type ShortcutState = {
  panel: string;
  show: boolean;
  dispatch: IShortcutSlice;
}

export const PANEL = {DEFAULT: "DEFAULT", VERSION: "VERSION"};


const useShortcutStore = create<ShortcutState>(
  (set) => ({
    panel: PANEL.DEFAULT,
    show: true,
    dispatch: {
      setPanel: (panel: string) => set(produce(state => {
        state.panel = panel;
      })),
      setShow: (show: boolean) => set(produce(state => {
        state.show = show;
      })),
    }
  })
);

export default useShortcutStore;
