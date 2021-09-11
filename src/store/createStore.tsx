import create, {State as BaseState} from "zustand";
import {devtools, redux, StateStorage} from "zustand/middleware";
import produce, {Draft} from "immer";

export type BaseAction = { type: string; payload: any }

export default <State extends BaseState, Action extends BaseAction>(
  actions: {
    [Type in Action["type"]]: (draft: Draft<State>, ...payload: any) => any;
  },
  initialState: State,
  storeName: string,
  storageName?: string,
  storage?: StateStorage,
  isPersist?: boolean
) => {
  const reducer = (state: State, event: Action) =>
    produce(state, (draft: Draft<State>) => {
      actions[event.type](draft, ...event.payload);
    });
  let useStore = create(devtools(redux(reducer, initialState), storeName));
  console.log('useStore', useStore)
  const api = useStore as typeof useStore & {
    dispatch: (action: Action) => Action;
  };
  const dispatch = Object.keys(actions).reduce((acc, key) => {
    // eslint-disable-next-line no-param-reassign
    acc[key] = (...args: any) =>
      api.dispatch({type: key, payload: args} as Action);
    return acc;
  }, {});

  return [useStore, actions, dispatch, api];
};

